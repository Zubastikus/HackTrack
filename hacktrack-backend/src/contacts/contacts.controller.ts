import { Controller, Get, Post, Body, Query, Req, Patch, Delete, Param } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { HackathonGuard } from '../auth/hackathon.guard';

@UseGuards(JwtAuthGuard, HackathonGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly service: ContactsService) {}

  @Post()
  create(@Body() body, @Req() req) {
    return this.service.create(body, req.user);
  }
  
  @Get()
  findAll(@Query() query: any, @Req() req) {
    return this.service.findAll(query, req.user);
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