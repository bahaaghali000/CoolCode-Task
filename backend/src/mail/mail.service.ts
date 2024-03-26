import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(dto: SendEmailDto) {
    const { to, from, subject, html } = dto;

    const options = {
      to,
      from,
      subject,
      html,
    };
    try {
      await this.mailerService.sendMail(options);
    } catch (error) {
      console.log(error);
    }
  }
}
