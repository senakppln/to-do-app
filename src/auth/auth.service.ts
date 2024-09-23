import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(authCredentialDto: AuthCredentialDto): Promise<any> {
    return this.usersService.createUser(authCredentialDto);
  }
  async signin(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { mail, password } = authCredentialDto;
    const user = await this.prisma.user.findUnique({ where: { mail } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { mail };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('invalid credentials');
    }
  }
}
