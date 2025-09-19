import { Injectable } from "@nestjs/common";
import  { DataSource } from "typeorm";

@Injectable()
export class HealthCheckService {
  constructor(private dataSource: DataSource) {}

  async check(): Promise< {server: string; database: string; } > {
    let dbStatus = 'OK';
    const serverStatus = 'OK';

    try {
      await this.dataSource.query('SELECT 1');
    } catch (error) {
      dbStatus = 'ERROR';
      console.error('Database health check failed:', error);
    }

    return {
      server: serverStatus,
      database: dbStatus,
    };
  }
}
