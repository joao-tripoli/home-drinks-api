import { Router } from 'express';
import drinksRoutes from './drinks.routes';
import healthRoutes from './health.routes';
import uploadcareRoutes from './uploadcare.routes';

const router: Router = Router();

// Health check routes
router.use('/health', healthRoutes);

// Drinks routes
router.use('/drinks', drinksRoutes);

// Uploadcare routes
router.use('/uploadcare', uploadcareRoutes);

export default router;
