import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import { Options } from 'nodemailer/lib/smtp-transport';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserData } from './AuthService';

@Injectable()
export class EmailService {
  protected logger = new Logger(EmailService.name);

  transporter: Transporter;

  fromName = 'LTC';
  fromEmail = 'failwin6720+ltc@gmail.com';

  constructor() {
    const options: Options = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };
    this.transporter = createTransport(options);
  }

  async sendVerificationCode(url: string, user: UserData) {
    const options: SendMailOptions = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: user.email,
      subject: 'Email verification',
      html: `<p>Click here: <a href="${url}">${url}</a></p>`,
    };
    const info = await this.transporter.sendMail(options);
    this.logger.log(JSON.stringify(info));
  }

  async sendResetPassword(url: string, email: string) {
    const options: SendMailOptions = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: email,
      subject: 'Reset password',
      html: `<p>Click here to reset your password: <a href="${url}">${url}</a></p>`,
    };
    const info = await this.transporter.sendMail(options);
    this.logger.log(JSON.stringify(info));
  }
}
