import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TIME_LOG_REPOSITORY } from '@/shared/constants/database.constants';
import { AppError } from '@/shared/appError.util';

import { TimeLog } from '@/entities/time-log.entity';
import { User } from '@/entities/user.entity';

import { TimeLogStatus } from '@/enums/time-status.enum';

@Injectable()
export class TimeLogService {
  constructor(
    @Inject(TIME_LOG_REPOSITORY)
    private readonly timeLogRepository: Repository<TimeLog>
  ) {}

  async getTimeLogById(id: string) {
    const entry = await this.timeLogRepository.findOne({
      where: { id },
    });

    if (!entry) {
      throw new AppError('Time entry not found', HttpStatus.NOT_FOUND);
    }

    return entry;
  }

  async startTime(user: Partial<User>) {
    const timeLog = this.timeLogRepository.create({
      status: TimeLogStatus.STARTED,
      startTime: new Date(),
      user: { id: user.id },
    });

    const result = await this.timeLogRepository.save(timeLog);

    return result;
  }

  async pauseTracking(id: string) {
    return await this.timeLogRepository.manager.transaction(async (tnx) => {
      const entry = await this.fetchTimeLogWithLock(id, tnx);

      if (!entry) {
        throw new AppError('Time entry not found', HttpStatus.NOT_FOUND);
      }

      if (entry.status === TimeLogStatus.NOT_STARTED) {
        throw new AppError('Timer is not running', HttpStatus.BAD_REQUEST);
      }

      if (entry.status === TimeLogStatus.PAUSED) {
        throw new AppError('Timer is already paused', HttpStatus.BAD_REQUEST);
      }

      // Calculate active time up to this pause
      const now = new Date();
      // Determine the last active timestamp (either last resumed time or start time)
      const lastActiveAt = entry.lastPausedAt ?? entry.startTime;

      // Calculate active time since last start/resume
      const activeTimeSinceLastAction = now.getTime() - lastActiveAt.getTime();

      /**
         * How activeTime Works in Your Logic
          •	When the timer starts, activeTime is 0 (or null if uninitialized).
          •	When the timer is paused, the system calculates how much time has passed since the last start/resume and adds that duration to activeTime.
          •	When the timer resumes, activeTime remains unchanged until the next pause.
          •	When the timer stops, activeTime contains the total tracked time.
         */
      entry.activeTime += activeTimeSinceLastAction; // Store in milliseconds
      entry.status = TimeLogStatus.PAUSED;
      entry.lastPausedAt = now;

      return await tnx.save(entry);
    });
  }

  async resumeTracking(id: string) {
    return await this.timeLogRepository.manager.transaction(async (tnx) => {
      const entry = await this.fetchTimeLogWithLock(id, tnx);

      if (!entry) {
        throw new AppError('Time entry not found', HttpStatus.NOT_FOUND);
      }

      if (entry.status === TimeLogStatus.STOPPED) {
        throw new AppError(
          'Unable to resume stopped time!',
          HttpStatus.BAD_REQUEST
        );
      }

      if (entry.status === TimeLogStatus.STARTED) {
        throw new AppError('Timer is already running', HttpStatus.BAD_REQUEST);
      }

      if (entry.lastPausedAt) {
        const pauseDuration =
          new Date().getTime() - entry.lastPausedAt.getTime();
        entry.totalPausedTime += pauseDuration;
      }

      entry.status = TimeLogStatus.STARTED;

      return await tnx.save(entry);
    });
  }

  async stopTracking(id: string) {
    return await this.timeLogRepository.manager.transaction(async (tnx) => {
      const entry = await this.fetchTimeLogWithLock(id, tnx);

      if (!entry) {
        throw new AppError('Time entry not found', HttpStatus.NOT_FOUND);
      }
      const now = new Date();

      // If it was running, calculate final active time
      if (entry.status === TimeLogStatus.STARTED) {
        const lastActiveAt = entry.lastPausedAt ?? entry.startTime;
        const activeTimeSinceLastAction =
          now.getTime() - lastActiveAt.getTime();
        entry.activeTime += activeTimeSinceLastAction;
      }

      // If it was paused, add to total paused time
      else if (entry.lastPausedAt) {
        const pauseDuration = now.getTime() - entry.lastPausedAt.getTime();
        entry.totalPausedTime += pauseDuration;
      }

      entry.status = TimeLogStatus.STOPPED;
      entry.endTime = now;

      const result = await tnx.save(entry);

      return result;
    });
  }

  private async fetchTimeLogWithLock(id: string, entityManager: EntityManager) {
    const entry = await entityManager
      .getRepository<TimeLog>(TimeLog)
      .createQueryBuilder('time_log')
      .setLock('pessimistic_write')
      .where({ id })
      .getOne();

    if (!entry) {
      throw new AppError('Time entry not found', HttpStatus.NOT_FOUND);
    }
    return entry;
  }
}
