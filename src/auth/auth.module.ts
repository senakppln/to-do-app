import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './dto/jwt.strategy';
import { JwtAuthGuard } from './dto/jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: 'TopSecret51',
      signOptions: { expiresIn: '16000s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PrismaService,
  ],
  exports: [JwtAuthGuard, PassportModule, RolesGuard],
})
export class AuthModule {}
