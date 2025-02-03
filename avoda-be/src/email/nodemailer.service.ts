import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';

import * as pug from 'pug';
import * as path from 'path';

type TemplateEmail = {
  template: string;
  data: Record<string, any>;
};

@Injectable()
export class EmailService {
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

  async sendTemplateEmail(
    { data, template }: TemplateEmail,
    mailOptions: MailOptions,
  ) {
    //Render the html for the email based on a pug template

    const html = await this.renderTemplate(template, data);

    return await this.createTransport().sendMail({
      html,
      ...mailOptions,
    });
  }

  async sendEmail(mailOptions: MailOptions) {
    return await this.createTransport().sendMail({
      ...mailOptions,
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
