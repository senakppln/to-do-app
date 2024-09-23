import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [AuthModule],
  providers: [TasksService, PrismaService],
  controllers: [TasksController],
})
export class TasksModule {}