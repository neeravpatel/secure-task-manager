import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Organization } from '../entities/organization.entity';
import { Role } from '../entities/role.entity';
import { Task } from '../entities/task.entity';
import { Permission } from '../entities/permission.entity';
import path from 'path';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: path.resolve(
          __dirname,
          '../../../',
          config.get<string>('DATABASE_PATH') || 'db/dev.sqlite',
        ),
        entities: [User, Organization, Role, Task, Permission],
        synchronize: true, // Set to false in production
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
