import { config } from '../config/environment';
import { ApiInfoResponseDTO, HealthResponseDTO } from '../dtos/health.dto';

export class HealthService {
  private startTime = Date.now();

  public getHealthStatus(): HealthResponseDTO {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      environment: config.NODE_ENV,
    };
  }

  public getApiInfo(): ApiInfoResponseDTO {
    return {
      message: 'Welcome to Home Drinks API',
      version: config.API_VERSION,
      status: 'running',
      environment: config.NODE_ENV,
    };
  }
}
