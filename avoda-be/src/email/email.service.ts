import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

import { MailOptions } from 'nodemailer/lib/json-transport';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue('avoda-redis-email-queue')
    private emailQueue: Queue
  ) {}

  async sendEmailAsync(emailData: MailOptions) {
    // Add job to the queue
    const job = await this.emailQueue.add(emailData, {
      // Optional job-specific options
      attempts: 3,
      removeOnComplete: true,
      timeout: 30000, // 30 seconds
    });

    return job.id;
  }

  // Optional: Method to get job status
  async getJobStatus(jobId: string) {
    const job = await this.emailQueue.getJob(jobId);
    return job ? job.data.status : null;
  }
}
