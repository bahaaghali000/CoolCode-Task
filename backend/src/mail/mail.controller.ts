import { Controller, Get, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('/api/v1/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Get()
  async sendEmail() {
    const options = {
      to: 'bahaaghali000@gmail.com',
      from: 'beboghali0@gmail.com',
      subject: 'Test',
      html: '<p>Test Mail</p>',
    };
    return await this.mailService.sendEmail(options);
  }
}
