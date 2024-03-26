export class SendEmailDto {
  from?: string;
  to: string;
  subject: string;
  html: string;
}
