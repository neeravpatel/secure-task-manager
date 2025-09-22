import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Permission } from '../entities/permission.entity';
import { Role } from '../entities/role.entity';
import { Organization } from '../entities/organization.entity';
import { User } from '../entities/user.entity';
import { Task } from '../entities/task.entity';
import { RoleName } from '../entities/role.enum';
import { PermissionName } from '../entities/permission.enum';
import { TaskStatus } from '../entities/task-status.enum';

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const orgRepo = dataSource.getRepository(Organization);
    const roleRepo = dataSource.getRepository(Role);
    const permRepo = dataSource.getRepository(Permission);

    const userFactory = factoryManager.get(User);
    const taskFactory = factoryManager.get(Task);

    // -----------------------
    // 1. Organizations (2-level)
    // -----------------------
    const corp = await orgRepo.save(orgRepo.create({ name: 'TechNova Corp' }));
    const rnd = await orgRepo.save(
      orgRepo.create({ name: 'TechNova R&D', parentOrganizationId: corp.id }),
    );
    const hr = await orgRepo.save(
      orgRepo.create({ name: 'TechNova HR', parentOrganizationId: corp.id }),
    );

    // -----------------------
    // 2. Permissions
    // -----------------------
    for (const name of Object.values(PermissionName)) {
      const existing = await permRepo.findOne({ where: { name } });
      if (!existing) {
        await permRepo.save(
          permRepo.create({
            name,
            description: `Permission to ${name.replace('_', '')}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        );
      }
    }

    const permissions = await permRepo.find();

    // -----------------------
    // 3. Roles
    // -----------------------
    const ownerRole = await roleRepo.save(
      roleRepo.create({
        name: RoleName.OWNER,
        organization: corp,
        permissions,
      }),
    );

    const adminPerms = permissions.filter((p) => p.name !== 'view_audit_log');
    const viewerPerms = permissions.filter((p) => p.name === PermissionName.VIEW_TASK);

    const adminRoleRND = await roleRepo.save(
      roleRepo.create({
        name: RoleName.ADMIN,
        organization: rnd,
        permissions: adminPerms,
      }),
    );

    const adminRoleHR = await roleRepo.save(
      roleRepo.create({
        name: RoleName.ADMIN,
        organization: hr,
        permissions: adminPerms,
      }),
    );

    const viewerRoleRND = await roleRepo.save(
      roleRepo.create({
        name: RoleName.VIEWER,
        organization: rnd,
        permissions: viewerPerms,
      }),
    );

    const viewerRoleHR = await roleRepo.save(
      roleRepo.create({
        name: RoleName.VIEWER,
        organization: hr,
        permissions: viewerPerms,
      }),
    );

    // -----------------------
    // 4. Users
    // -----------------------
    const alice = await userFactory.save({
      email: 'alice@technova.com',
      organization: corp,
      role: ownerRole,
    });

    const bob = await userFactory.save({
      email: 'bob@rnd.technova.com',
      organization: rnd,
      role: adminRoleRND,
    });

    const carol = await userFactory.save({
      email: 'carol@hr.technova.com',
      organization: hr,
      role: adminRoleHR,
    });

    const dave = await userFactory.save({
      email: 'dave@rnd.technova.com',
      organization: rnd,
      role: viewerRoleRND,
    });

    const eve = await userFactory.save({
      email: 'eve@hr.technova.com',
      organization: hr,
      role: viewerRoleHR,
    });

    // -----------------------
    // 5. Tasks (Job-relevant examples)
    // -----------------------
    await taskFactory.save({
      title: 'Review system audit logs',
      description: 'Ensure RBAC audit logs are complete.',
      user: alice,
      organization: corp,
      status: TaskStatus.COMPLETED,
    });

    await taskFactory.save({
      title: 'Plan cloud migration',
      description: 'Prepare roadmap for Kubernetes migration.',
      user: alice,
      organization: corp,
      status: TaskStatus.IN_PROGRESS,
    });

    await taskFactory.save({
      title: 'Implement Angular JWT login',
      description: 'Use NgRx for state management.',
      user: bob,
      organization: rnd,
      status: TaskStatus.PENDING,
    });

    await taskFactory.save({
      title: 'Add RBAC guards to Fastify API',
      description: 'Decorators and permissions check.',
      user: dave,
      organization: rnd,
      status: TaskStatus.IN_PROGRESS,
    });

    await taskFactory.save({
      title: 'Prepare HR security onboarding',
      description: 'Guide for new hires on security best practices.',
      user: carol,
      organization: hr,
      status: TaskStatus.PENDING,
    });

    await taskFactory.save({
      title: 'Audit HR access logs',
      description: 'Review employee access and permissions.',
      user: eve,
      organization: hr,
      status: TaskStatus.COMPLETED,
    });

    console.log('✅ Seeding complete for TechNova challenge!');
  }
}
