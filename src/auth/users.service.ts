import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'prisma/prisma.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(authCredentialDto: AuthCredentialDto): Promise<any> {
    const { mail, password } = authCredentialDto;

    const existingUser = await this.prisma.user.findUnique({ where: { mail } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.prisma.user.create({
      data: { mail, password: hashedPassword },
    });

    return user;
  }
}
