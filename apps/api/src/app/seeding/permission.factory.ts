import { setSeederFactory } from 'typeorm-extension';
import { Permission } from '../entities/permission.entity';

export const PermissionFactory = setSeederFactory(Permission, () => {
  const permission = new Permission();

  return permission;
});
