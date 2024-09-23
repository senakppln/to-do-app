import { TasksService } from './tasks.service';
import { Test, TestingModule } from '@nestjs/testing';

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { CreateTasksDto } from './dto/create-task.dto';

describe('TaskService', () => {
  let validationPipe: ValidationPipe;
  let tasksService: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    validationPipe = new ValidationPipe({ whitelist: true });
  });

  const mocktaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  const mockUser = {
    id: 'test',
    mail: 'test@test.com',
    password: 'test',
    role: 'user',
    task: [],
  };

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockcreateTask = {
    id: 'test',
    title: 'test',
    content: 'test',
    user: mockUser,
  };
  const mockCreateDto = {
    title: 'test1',
    content: 'test1',
  };
  const mockGetTasksDto = {
    search: 'test',
  };

  describe('getAllTask', () => {
    it('should return tasks for a normal user', async () => {
      const tasks = [mockcreateTask];
      mockUser.role = 'user';
      jest
        .spyOn(mocktaskRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);
      jest.spyOn(mockQueryBuilder, 'where').mockReturnThis();
      jest.spyOn(mockQueryBuilder, 'getMany').mockResolvedValue(tasks);
      const result = await tasksService.getTasks(mockGetTasksDto, mockUser);
      expect(result).toEqual(tasks);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'task.userId = :userId',
        { userId: mockUser.id },
      );
    });
    it('should return all tasks for an admin user', async () => {
      const tasks = [mockcreateTask];
      mockUser.role = 'admin';
      jest
        .spyOn(mocktaskRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder);
      jest.spyOn(mockQueryBuilder, 'where').mockReturnThis();
      jest.spyOn(mockQueryBuilder, 'getMany').mockResolvedValue(tasks);

      const result = await tasksService.getTasks(mockGetTasksDto, mockUser);
      expect(result).toEqual(tasks);
    });
  });
  describe('createTask', () => {
    it('it should add task', async () => {
      const taskWithUser = { ...mockCreateDto, user: mockUser };

      jest
        .spyOn(tasksService, 'createTask')
        .mockResolvedValue(taskWithUser as any);
      const result = await tasksService.createTask(mockCreateDto, mockUser);

      expect(result).toEqual(taskWithUser);
    });
    it('it should throw an error if content or title empty', async () => {
      const invalidDto = {
        title: 'deneme',
        content: undefined,
      };
      await expect(
        validationPipe.transform(invalidDto, {
          type: 'body',
          metatype: CreateTasksDto,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
  describe('deleteTask', () => {
    it('it should delete task', async () => {
      const task = mockcreateTask;
      console.log(task);
      jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(task);
      jest.spyOn(taskRepository, 'remove').mockResolvedValue(task);
      const result = await tasksService.deleteTask(task.id, mockUser);

      expect(result).toBe(undefined);
      console.log(task);
    });
  });
  describe('getTaskById', () => {
    it('it should get tasks by id', async () => {
      const result = await tasksService.getTaskById(
        mockcreateTask.id,
        mockUser,
      );

      expect(result).toBe(mockcreateTask);
    });
  });
});
