import { Controller, Post, Get, Res, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('import')
export class ImportController {
  constructor(private readonly service: ImportService) {}

  @Post('participants')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  importParticipants(@UploadedFile() file: any, @Req() req: any) {
    //console.log(file);
    return this.service.importParticipants(
      file,
      req.user.hackathonId,
    );
  }

  @Post('tracks')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadTracks(@UploadedFile() file: any, @Req() req: any) {
    return this.service.importTracks(
      file,
      req.user.hackathonId,
    );
  }

  @Post('teams')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadTeams(@UploadedFile() file: any, @Req() req: any) {
    return this.service.importTeams(
      file,
      req.user.hackathonId,
    );
  }
  
  @Post('contacts') 
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadUsers(@UploadedFile() file: any, @Req() req: any) {
    return this.service.importContacts(
      file,
      req.user.hackathonId,
    );
  }

  @Post('schedule')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadSchedule(@UploadedFile() file: any, @Req() req: any) {
    return this.service.importSchedule(
      file,
      req.user.hackathonId,
    );
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  async export(@Res() res: any, @Req() req: any) {
    const buffer = await this.service.exportAll(req.user.hackathonId,);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=hacktrack.xlsx',
    });

    res.send(buffer);
  }
}