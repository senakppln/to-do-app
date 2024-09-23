import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTasksDto } from './dto/create-task.dto';
import { GetUser } from '../auth/get-user.decorator';
import { GetTaskFilter } from './dto/gettask-filter.dto';
import { JwtAuthGuard } from 'src/auth/dto/jwt-auth.guard';
import { UpdateTaskDto } from './dto/update-task.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { task, user } from '@prisma/client';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { TaskSchema } from './schemas/task-zod.schema';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(TaskSchema))
  async createTask(
    @Body() createTaskDto: CreateTasksDto,
    @GetUser() user: user,
  ): Promise<task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: user,
  ): Promise<task> {
    return this.tasksService.getTaskById(id, user);
  }
  @Delete('/:id')
  async deleteTask(
    @Param('id') id: string,
    @GetUser() user: user,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }
  @Get()
  async getTaskFilter(
    @Query() getTaskFilter: GetTaskFilter,
    @GetUser() user: user,
  ): Promise<task[]> {
    return this.tasksService.getTasks(getTaskFilter, user);
  }
  @Patch('/:id')
  @UsePipes(new ZodValidationPipe(TaskSchema))
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: user,
  ): Promise<task> {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }
}
