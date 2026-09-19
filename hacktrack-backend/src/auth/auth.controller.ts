import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
  return this.authService.register({
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      phone: body.phone,
  });
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(
      body.email,
      body.password,
    );
  }

  @Post('select-hackathon')
  @UseGuards(JwtAuthGuard)
  selectHackathon(@Req() req: any, @Body() body: any) {
    return this.authService.selectHackathon(
      req.user.userId,
      body.hackathonId,
  );
}
}