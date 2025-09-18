import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

const router: Router = Router();
const healthController = new HealthController();

// Health check routes
router.get('/', healthController.getApiInfo);
router.get('/health', healthController.getHealthStatus);

export default router;
