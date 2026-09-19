import {
  Controller,
  Get,
  Post,
  Body,
  Query, 
  UseGuards,
  Req, Patch, Delete, Param
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HackathonGuard } from '../auth/hackathon.guard';

@UseGuards(JwtAuthGuard, HackathonGuard)
@Controller('tracks')
export class TracksController {
  constructor(private readonly service: TracksService) {}

  @Post()
  create(@Body() body, @Req() req) {
    return this.service.create(body, req.user);
  }

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.hackathonId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body, @Req() req) {
    return this.service.update(id, body, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    return this.service.remove(id, req.user);
  }
}