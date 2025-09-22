import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { Organization } from '../entities/organization.entity';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';
import { OrganizationFactory } from './organization.factory';
import { PermissionFactory } from './permission.factory';
import { RoleFactory } from './role.factory';
import { UserFactory } from './user.factory';
import { TaskFactory } from './task.factory';
import { MainSeeder } from './main.seeder';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const databasePath = process.env.DATABASE_PATH || 'db/dev.sqlite';

const options: DataSourceOptions & SeederOptions = {
  type: 'sqlite',
  database: path.resolve(__dirname, '../../../', databasePath),
  entities: [Organization, Permission, Role, User, Task],
  factories: [OrganizationFactory, PermissionFactory, RoleFactory, UserFactory, TaskFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);
dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
