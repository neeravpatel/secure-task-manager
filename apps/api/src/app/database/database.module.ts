import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { Task } from '../entities/task.entity';
import { Permission } from '../entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DATABASE_PATH'),
        entities: [User, Organization, Role, Task, Permission],
        synchronize: true, // Set to false in production
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
