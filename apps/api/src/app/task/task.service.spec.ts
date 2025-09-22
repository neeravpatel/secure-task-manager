import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import { Repository } from 'typeorm';
import { RoleName } from '@secure-task-manager/data';

describe('TaskService', () => {
  let service: TaskService;
  let taskRepo: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(Role), useValue: { findOne: jest.fn() } },
        { provide: getRepositoryToken(Organization), useValue: {} },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepo = module.get(getRepositoryToken(Task));
  });

  it('should return all org tasks for admin', async () => {
    const testUser = {
      id: '1',
      organizationId: 'org1',
      roleId: 'role1',
      email: 'admin@example.com',
      passwordHash: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const role = { name: RoleName.ADMIN };
    jest.spyOn(Object.getPrototypeOf(service), 'getRoleById').mockResolvedValue(role);
    const findSpy = jest.spyOn(taskRepo, 'find').mockResolvedValue(['task1'] as never);

    const result = await service.getTasksByUser(testUser);
    expect(findSpy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { organizationId: testUser.organizationId } }),
    );

    expect(result).toEqual(['task1']);
  });

  it('should return only user tasks for viewer', async () => {
    const testUser = {
      id: '2',
      organizationId: 'org1',
      roleId: 'role2',
      email: 'viewer@example.com',
      passwordHash: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const role = { name: RoleName.VIEWER };
    jest.spyOn(Object.getPrototypeOf(service), 'getRoleById').mockResolvedValue(role);
    const findSpy = jest.spyOn(taskRepo, 'find').mockResolvedValue(['task2'] as never);

    const result = await service.getTasksByUser(testUser);
    expect(findSpy).toHaveBeenCalledWith(
      expect.objectContaining({ where: { assigneeUserId: testUser.id } }),
    );
    expect(result).toEqual(['task2']);
  });
});
