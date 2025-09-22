import { Body, Controller, Get, Post, Put, UseGuards, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard, RoleGuard, Roles, GetUser, Permissions } from '@secure-task-manager/auth';
import { CreateTaskDto, PermissionName, RoleName, User } from '@secure-task-manager/data';
import { TaskService } from './task.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @Roles(RoleName.ADMIN, RoleName.OWNER)
  @Permissions(PermissionName.CREATE_TASK)
  createTask(
    @Body() dto: CreateTaskDto,
    @GetUser() createdUser: User,
    @GetUser() assigneeUser: User,
  ) {
    return this.taskService.createTask(createdUser, assigneeUser, dto);
  }

  @Get()
  @Permissions(PermissionName.VIEW_TASK)
  getTasks(@GetUser() user: User) {
    return this.taskService.getTasksByUser(user);
  }

  @Put(':id')
  @Roles(RoleName.ADMIN, RoleName.OWNER)
  @Permissions(PermissionName.EDIT_TASK)
  updateTask(@Param('id') taskId: string, @Body() dto: CreateTaskDto, @GetUser() user: User) {
    return this.taskService.updateTask(user, taskId, dto);
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN, RoleName.OWNER)
  @Permissions(PermissionName.DELETE_TASK)
  deleteTask(@Param('id') taskId: string, @GetUser() user: User) {
    return this.taskService.deleteTask(user, taskId);
  }
}
