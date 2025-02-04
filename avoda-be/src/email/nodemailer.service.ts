// import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

import * as pug from 'pug';
import * as path from 'path';

import { TemplateEmail } from '@/@types/email.type';

@Processor('avoda-redis-email-queue')
export class NodeMailerService {
  constructor(private configService: ConfigService) {}

  private createTransport() {
    return nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST_NAME'),
      port: this.configService.get<number>('SMTP_HOST_PORT'),
      auth: {
        user: this.configService.get<string>('SMTP_AUTH_USER'),
        pass: this.configService.get<string>('SMTP_AUTH_PASSWORD'),
      },
    });
  }

  async sendTemplateEmail(job: Job<MailOptions & TemplateEmail>) {
    //Render the html for the email based on a pug template
    const html = await this.renderTemplate(job.data.template, job.data.data);

    return await this.createTransport().sendMail({
      html,
      ...job.data,
    });
  }

  @Process()
  async sendEmail(job: Job<MailOptions>) {
    return await this.createTransport().sendMail({
      ...job.data,
    });
  }

  private async renderTemplate(template: string, data: Record<string, any>) {
    // Implement template rendering logic here
    return pug.renderFile(template, {
      data,
      basedir: path.join(__dirname, '/templates'),
      context: { data },
    });
  }
}
