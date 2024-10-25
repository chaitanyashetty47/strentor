import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    // Test database connection by performing a simple query
    await prisma.$queryRaw`SELECT 1`;

    const health = {
      status: 'OK',
      timestamp: new Date(),
      service: 'Courshala API',
      database: {
        status: 'connected',
        healthy: true,
        type: 'PostgreSQL'
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };

    res.status(200).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const healthError = {
      status: 'ERROR',
      timestamp: new Date(),
      service: 'Courshala API',
      database: {
        status: 'disconnected',
        healthy: false,
        type: 'PostgreSQL'
      },
      error: error instanceof Error ? error.message : 'Database connection failed'
    };

    res.status(503).json(healthError);
  }
};

// Detailed health check with database connection status and system info
export const checkDetailedHealth = async (req: Request, res: Response): Promise<void> => {
  try {
    // Test database connection
    const startTime = performance.now();
    await prisma.$queryRaw`SELECT 1`;
    const queryTime = performance.now() - startTime;

    // Get PostgreSQL version
    const versionResult = await prisma.$queryRaw<[{version: string}]>`SELECT version()`;
    
    const health = {
      status: 'OK',
      timestamp: new Date(),
      service: 'Courshala API',
      database: {
        status: 'connected',
        healthy: true,
        type: 'PostgreSQL',
        metrics: {
          responseTime: `${queryTime.toFixed(2)}ms`,
          version: versionResult[0].version
        }
      },
      system: {
        uptime: process.uptime(),
        memory: {
          heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB`,
          heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)}MB`,
          rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB`
        },
        nodeVersion: process.version,
        platform: process.platform,
        env: process.env.NODE_ENV || 'development'
      }
    };

    res.status(200).json(health);
  } catch (error) {
    console.error('Detailed health check failed:', error);
    
    const healthError = {
      status: 'ERROR',
      timestamp: new Date(),
      service: 'Courshala API',
      database: {
        status: 'disconnected',
        healthy: false,
        type: 'PostgreSQL'
      },
      error: error instanceof Error ? error.message : 'Database connection failed',
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        env: process.env.NODE_ENV || 'development'
      }
    };

    res.status(503).json(healthError);
  }
};