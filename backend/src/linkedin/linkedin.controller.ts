import { Controller, Get, UseGuards } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/auth/get-user.decorater';
import { User } from 'src/schemas/user.schema';

@UseGuards(AuthGuard)
@Controller('linkedin')
export class LinkedinController {
  constructor(private readonly linkedinService: LinkedinService) {}
  @Get('scrape')
  async scrapeLinkedInData(@GetUser() user: User): Promise<any> {
    return this.linkedinService.scrapeUserData(user);
  }
}
