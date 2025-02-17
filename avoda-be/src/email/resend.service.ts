import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateEmailOptions, Resend } from 'resend';

import * as pug from 'pug';
import * as path from 'path';

type TemplateEmail = {
  template: string;
  data: Record<string, any>;
};

@Injectable()
export class ResendService {
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
  }

  async sendEmail({
    from = this.configService.get<string>('DEFAULT_FROM_EMAIL'),
    ...mailOptions
  }: CreateEmailOptions) {
    const { data, error } = await this.resend.emails.send({
      from,
      ...mailOptions,
    });

    // allow the caller of this function to handle the error appropriately
    // The caller can implement a retry logic in the queue
    return { data, error };
  }

  // Helper method for sending template-based emails
  async sendTemplateEmail(
    { template, data }: TemplateEmail,
    emailOptions: CreateEmailOptions,
  ) {
    // Here you could integrate with a template engine of your choice
    // We use Pug because it's easy to template and support partials
    const html = await this.renderTemplate(template, data);

    return this.sendEmail({ html, ...emailOptions });
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
