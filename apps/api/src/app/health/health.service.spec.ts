import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService } from './health.service';
import { DataSource } from 'typeorm';

describe('HealthCheckService', () => {
  let service: HealthCheckService;
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = {
      query: jest.fn().mockResolvedValue([1]),
    } as unknown as DataSource;

    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthCheckService, { provide: DataSource, useValue: dataSource }],
    }).compile();

    service = module.get<HealthCheckService>(HealthCheckService);
  });

  it('should return OK for healthy DB', async () => {
    const result = await service.check();
    expect(result).toEqual({ server: 'OK', database: 'OK' });
    expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('should return ERROR if DB check fails', async () => {
    (dataSource.query as jest.Mock).mockRejectedValueOnce(new Error('fail'));
    const result = await service.check();
    expect(result).toEqual({ server: 'OK', database: 'ERROR' });
  });
});
