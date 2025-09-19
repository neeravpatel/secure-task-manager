import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
// import { Organization } from '../entities/organization.entity';
// import { Role } from '../entities/role.entity';
// import { Task } from '../entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.get<string>('DATABASE_NAME'),
        entities: [User],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
