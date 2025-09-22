import { setSeederFactory } from 'typeorm-extension';
import { Task } from '../entities/task.entity';
import { TaskStatus } from '@secure-task-manager/data';

export const TaskFactory = setSeederFactory(Task, (faker) => {
  const task = new Task();
  task.title = faker.lorem.words(3);
  task.description = faker.lorem.sentence();
  task.status = faker.helpers.arrayElement([
    TaskStatus.PENDING,
    TaskStatus.IN_PROGRESS,
    TaskStatus.COMPLETED,
  ]);
  task.createdAt = new Date();
  task.updatedAt = new Date();
  return task;
});
