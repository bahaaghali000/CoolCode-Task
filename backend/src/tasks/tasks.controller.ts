import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { FilterDto } from './dto/get-tasks-filter.dto';
import { Task } from 'src/schemas/Task.schema';
import { AuthGuard } from 'src/auth/auth.guard';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetUser } from 'src/auth/get-user.decorater';
import { User } from 'src/schemas/user.schema';
import { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('/api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  getTasks(
    @Query() filterDto: FilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:taskId')
  getTaskById(
    @Param('taskId') taskId: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(taskId, user);
  }

  @Patch('/:taskId/status')
  updateTaskStatus(
    @Param('taskId') taskId: string,
    @Query('status') status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(taskId, status, user);
  }

  @Patch('/:taskId')
  updateTask(
    @Param('taskId') taskId: string,
    @Body() body: any,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTask(taskId, body,user);
  }

  @Patch('/:taskId/addMember')
  addMember(
    @Param('taskId') taskId: string,
    @Body('memberId') memberId: string,
    @GetUser() user: User,
  ) {
    return this.tasksService.addMember(taskId, memberId, user);
  }

  @Delete('/:taskId')
  deleteTask(@Param('taskId') taskId: string, @GetUser() user: User) {
    return this.tasksService.deleteTask(taskId, user);
  }
}
