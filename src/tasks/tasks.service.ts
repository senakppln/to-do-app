import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTasksDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/gettask-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'prisma/prisma.service';
import { task, user } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async createTask(createTaskDto: CreateTasksDto, user: user): Promise<any> {
    const task = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        content: createTaskDto.content,
        user: {
          connect: { id: user.id },
        },
      },
    });
    return task;
  }

  async getTasks(getTaskFilter: GetTaskFilter, user: user): Promise<any[]> {
    const { search } = getTaskFilter;
    if (user.role === 'admin') {
      return this.prisma.task.findMany({
        where: {
          OR: search
            ? [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
              ]
            : undefined,
        },
      });
    }

    return this.prisma.task.findMany({
      where: {
        userId: user.id,
        AND: search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
              ],
            }
          : undefined,
      },
    });
  }

  async getTaskById(id: string, user: user): Promise<any> {
    let note;

    if (user.role === 'admin') {
      note = await this.prisma.task.findUnique({ where: { id } });
    } else {
      note = await this.prisma.task.findUnique({
        where: { id, userId: user.id },
      });
    }

    if (!note) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return note;
  }
  async deleteTask(id: string, user: user): Promise<void> {
    let task;
    if (user.role === 'admin') {
      task = await this.prisma.task.findUnique({ where: { id } });
    } else {
      task = await this.prisma.task.findUnique({
        where: { id, userId: user.id },
      });
    }
    if (!task) {
      throw new NotFoundException();
    }
    await this.prisma.task.delete({ where: { id: task.id } });
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: user,
  ): Promise<task> {
    let note;
    if (user.role === 'admin') {
      note = await this.prisma.task.findUnique({ where: { id } });
    } else {
      note = await this.prisma.task.findUnique({
        where: { id, userId: user.id },
      });
    }
    const { title, content } = updateTaskDto;
    if (!note) {
      throw new NotFoundException();
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: note.id },
      data: {
        title: title || note.title,
        content: content || note.content,
      },
    });

    return updatedTask;
  }
}
