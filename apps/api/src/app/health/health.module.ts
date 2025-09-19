import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthCheckService } from './health.service';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthCheckService],
})
export class HealthModule {}
