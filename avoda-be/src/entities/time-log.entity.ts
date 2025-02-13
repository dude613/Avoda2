import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

import { TimeLogStatus } from '@/enums/time-status.enum';

@Entity()
export class TimeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.timeLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({
    default: TimeLogStatus.NOT_STARTED,
    enum: TimeLogStatus,
    type: 'enum',
  })
  status: TimeLogStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastPausedAt: Date;

  @Column({ type: 'int', default: 0 })
  totalPausedTime: number; // in milliseconds

  @Column({ type: 'int', default: 0 })
  activeTime: number; // in milliseconds - updated when pausing/resuming/stopping

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
