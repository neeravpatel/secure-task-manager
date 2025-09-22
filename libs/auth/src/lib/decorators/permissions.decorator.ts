import { SetMetadata } from '@nestjs/common';
import { PermissionName } from '@secure-task-manager/data';

export const Permissions = (...permissions: PermissionName[]) =>
  SetMetadata('permissions', permissions);
