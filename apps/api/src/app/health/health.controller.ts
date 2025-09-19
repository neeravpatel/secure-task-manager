import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthCheckService) {}

  @Get()
  async checkHealth(): Promise<{ server: string; database: string }> {
    return this.healthService.check();
  }
}
