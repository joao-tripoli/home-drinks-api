import { Router } from 'express';
import { DrinksController } from '../controllers/drinks.controller';

const router: Router = Router();
const drinksController = new DrinksController();

// Drinks routes
router.get('/', drinksController.getAllDrinks);
router.get('/search', drinksController.searchDrinks);
router.get('/category/:category', drinksController.getDrinksByCategory);
router.get('/:id', drinksController.getDrinkById);
router.post('/', drinksController.createDrink);
router.put('/:id', drinksController.updateDrink);
router.delete('/:id', drinksController.deleteDrink);

export default router;
