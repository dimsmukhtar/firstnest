import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // create endpoint/route
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    // decorator @Req() req: Request biasa dari express, tapi jangan pakai ini karena kita tidak tahu kedepannya masih bisa atau ngga
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
