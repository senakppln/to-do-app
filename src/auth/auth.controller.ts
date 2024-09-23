import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../validation/zod-validation.pipe';
import { AuthCredentialSchema } from './shemas/auth-credential-zod.schema';

@Controller('auth')
@UsePipes(new ZodValidationPipe(AuthCredentialSchema))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() authCredentialDto: AuthCredentialDto): Promise<any> {
    return this.authService.signup(authCredentialDto);
  }
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signin(authCredentialDto);
  }
}
