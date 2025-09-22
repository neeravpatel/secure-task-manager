import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import {
  CreateTaskDto,
  RoleName,
  TaskStatus,
  UpdateTaskDto,
  User,
} from '@secure-task-manager/data';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
    @InjectRepository(Organization) private organizationRepository: Repository<Organization>,
  ) {}

  private async getRoleById(roleId: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ where: { id: roleId } });

    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  private async getOrganizationById(organizationId: string): Promise<Organization> {
    const organization = await this.organizationRepository.findOne({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async createTask(createdUser: User, assigneeUser: User, dto: CreateTaskDto) {
    const role = await this.getRoleById(createdUser.roleId);

    if (![RoleName.ADMIN, RoleName.OWNER].includes(role.name)) {
      throw new NotFoundException('Insufficient permissions to create tasks.');
    }

    const organization = await this.getOrganizationById(createdUser.organizationId);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const task = this.taskRepository.create({
      ...dto,
      createdUser: createdUser,
      assigneeUser: assigneeUser,
      organization,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.taskRepository.save(task);
  }

  async getTasksByUser(user: User) {
    const role = await this.getRoleById(user.roleId);

    if ([RoleName.ADMIN, RoleName.OWNER].includes(role.name)) {
      return this.taskRepository.find({
        where: { organizationId: user.organizationId },
        relations: ['assigneeUser', 'createdUser', 'organization'],
        order: { createdAt: 'DESC' },
      });
    } else {
      return this.taskRepository.find({
        where: { assigneeUserId: user.id },
        relations: ['assigneeUser', 'createdUser', 'organization'],
        order: { createdAt: 'DESC' },
      });
    }
  }

  async updateTask(user: User, taskId: string, dto: UpdateTaskDto) {
    const role = await this.getRoleById(user.roleId);

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['user', 'organization'],
    });

    if (task.createdUserId !== user.id && ![RoleName.ADMIN, RoleName.OWNER].includes(role.name)) {
      throw new NotFoundException('Insufficient permissions to update tasks.');
    }

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    Object.assign(task, dto, { updatedAt: new Date() });
    return this.taskRepository.save(task);
  }

  async deleteTask(user: User, taskId: string) {
    const role = await this.getRoleById(user.roleId);

    const task = await this.taskRepository.findOne({
      where: { id: taskId },
      relations: ['user', 'organization'],
    });

    if (task.createdUserId !== user.id && ![RoleName.ADMIN, RoleName.OWNER].includes(role.name)) {
      throw new NotFoundException('Insufficient permissions to delete tasks.');
    }

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.taskRepository.remove(task);
  }
}
