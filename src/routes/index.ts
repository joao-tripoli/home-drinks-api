import { Router } from 'express';
import drinksRoutes from './drinks.routes';
import healthRoutes from './health.routes';

const router: Router = Router();

// Mount route modules
router.use('/', healthRoutes);
router.use('/drinks', drinksRoutes);

export default router;
