import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HackathonsService } from './hackathons.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('hackathons')
@UseGuards(JwtAuthGuard)
export class HackathonsController {
  constructor(private service: HackathonsService) {}

  @Get()
  findAll(@Req() req) {
    return this.service.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  create(@Body() body, @Req() req) {
    return this.service.create(body, req.user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body, @Req() req) {
    return this.service.update(+id, body, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.service.remove(+id, req.user);
  }

  @Post(':id/add-user')
  addUser(
    @Param('id') id: number,
    @Body('email') email: string,
  ) {
    return this.service.addUserByEmail(id, email);
  }
}