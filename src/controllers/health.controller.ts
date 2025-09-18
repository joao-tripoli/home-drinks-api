import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';
import { logger } from '../utils/logger';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  public getApiInfo = (req: Request, res: Response): void => {
    try {
      logger.info('API info requested', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      const apiInfo = this.healthService.getApiInfo();
      res.json(apiInfo);
    } catch (error) {
      logger.error('Error getting API info', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getHealthStatus = (req: Request, res: Response): void => {
    try {
      logger.debug('Health check requested', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      const healthStatus = this.healthService.getHealthStatus();
      res.json(healthStatus);
    } catch (error) {
      logger.error('Error getting health status', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
