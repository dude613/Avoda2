import { MailOptions } from 'nodemailer/lib/json-transport';

export type TemplateEmail = {
  template: string;
  data: Record<string, any>;
  mailOptions: MailOptions;
};
