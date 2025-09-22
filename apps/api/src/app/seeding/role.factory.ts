import { setSeederFactory } from 'typeorm-extension';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import { RoleName } from '@secure-task-manager/data';

export const RoleFactory = setSeederFactory(Role, (faker) => {
  const role = new Role();
  role.name = faker.helpers.arrayElement([RoleName.ADMIN, RoleName.OWNER, RoleName.VIEWER]);
  role.organizationId = faker.helpers.arrayElement<Organization['id']>([]);
  role.createdAt = new Date();
  role.updatedAt = new Date();
  return role;
});
