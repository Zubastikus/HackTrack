import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HackathonGuard } from '../auth/hackathon.guard';

@UseGuards(JwtAuthGuard, HackathonGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post('send')
  send(@Body() body: { message: string }, @Req() req: any) {
    return this.service.sendToHackathon(
      req.user.hackathonId,
      body.message
    );
  }
}