import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthenticationGuard } from './localAuth.guard';

@Controller('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto): Observable<string> {
    return this.authService.register(body);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  login(
    @Req() request: { user: LoginDto },
  ): Observable<{ access_token: string }> {
    return this.authService.login(request.user);
  }
}
