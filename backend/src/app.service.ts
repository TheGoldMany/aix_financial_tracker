import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'penzugyi-koveto-api',
    };
  }

  getVersion(): object {
    return {
      version: '1.0.0',
      apiVersion: 'v1',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
