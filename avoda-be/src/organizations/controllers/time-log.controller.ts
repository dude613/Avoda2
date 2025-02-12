import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { User } from '@/entities/user.entity';

import { EmptyValueValidationPipe } from '@/pipes/isValueEmpty.pipe';

import { TimeLogService } from '../services/time-log.service';

@Controller('organizations/:id/time-entry')
export class TimeLogController {
  constructor(private readonly timeLogService: TimeLogService) {}

  @Get('/:logId')
  getTimeLogById(@Param('logId') id: string) {
    return this.timeLogService.getTimeLogById(id);
  }

  @Post('/')
  startTime(@CurrentUser() user: Partial<User>) {
    return this.timeLogService.startTime(user);
  }

  @Patch('/pause')
  @HttpCode(HttpStatus.OK)
  pauseTracking(@Body('id', new EmptyValueValidationPipe()) entryId: string) {
    return this.timeLogService.pauseTracking(entryId);
  }

  @Patch('/resume')
  @HttpCode(HttpStatus.OK)
  resumeTracking(@Body('id', new EmptyValueValidationPipe()) entryId: string) {
    return this.timeLogService.resumeTracking(entryId);
  }

  @Patch('/stop')
  @HttpCode(HttpStatus.OK)
  stopTracking(@Body('id', new EmptyValueValidationPipe()) entryId: string) {
    return this.timeLogService.stopTracking(entryId);
  }
}
