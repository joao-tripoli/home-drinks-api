import { Request, Response } from 'express';
import { CreateDrinkDTO, UpdateDrinkDTO } from '../dtos/drinks.dto';
import { DrinksService } from '../services/drinks.service';
import { logger } from '../utils/logger';

export class DrinksController {
  private drinksService: DrinksService;

  constructor() {
    this.drinksService = new DrinksService();
  }

  public getAllDrinks = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          error:
            'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.',
        });
        return;
      }

      logger.info('Fetching all drinks', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        page,
        limit,
      });

      const result = await this.drinksService.getAllDrinks(page, limit);
      res.json(result);
    } catch (error) {
      logger.error('Error fetching all drinks', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getDrinkById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      logger.info('Fetching drink by ID', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
      });

      const drink = await this.drinksService.getDrinkById(id);

      if (!drink) {
        res.status(404).json({ error: 'Drink not found' });
        return;
      }

      res.json(drink);
    } catch (error) {
      logger.error('Error fetching drink by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getDrinksByCategory = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          error:
            'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.',
        });
        return;
      }

      logger.info('Fetching drinks by category', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        category,
        page,
        limit,
      });

      const result = await this.drinksService.getDrinksByCategory(
        category,
        page,
        limit
      );
      res.json(result);
    } catch (error) {
      logger.error('Error fetching drinks by category', {
        error: error instanceof Error ? error.message : 'Unknown error',
        category: req.params.category,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public searchDrinks = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query || query.trim().length === 0) {
        res.status(400).json({ error: 'Search query is required' });
        return;
      }

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        res.status(400).json({
          error:
            'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100.',
        });
        return;
      }

      logger.info('Searching drinks', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        query,
        page,
        limit,
      });

      const result = await this.drinksService.searchDrinks(query, page, limit);
      res.json(result);
    } catch (error) {
      logger.error('Error searching drinks', {
        error: error instanceof Error ? error.message : 'Unknown error',
        query: req.query.q,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public createDrink = async (req: Request, res: Response): Promise<void> => {
    try {
      const drinkData: CreateDrinkDTO = req.body;

      // Validate required fields
      if (
        !drinkData.name ||
        !drinkData.category ||
        !drinkData.ingredients ||
        !drinkData.instructions
      ) {
        res.status(400).json({
          error:
            'Missing required fields: name, category, ingredients, instructions',
        });
        return;
      }

      logger.info('Creating new drink', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkName: drinkData.name,
      });

      const drink = await this.drinksService.createDrink(drinkData);
      res.status(201).json(drink);
    } catch (error) {
      logger.error('Error creating drink', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public updateDrink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const drinkData: UpdateDrinkDTO = req.body;

      logger.info('Updating drink', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
      });

      const drink = await this.drinksService.updateDrink(id, drinkData);

      if (!drink) {
        res.status(404).json({ error: 'Drink not found' });
        return;
      }

      res.json(drink);
    } catch (error) {
      logger.error('Error updating drink', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public deleteDrink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      logger.info('Deleting drink', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
      });

      await this.drinksService.deleteDrink(id);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting drink', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public uploadDrinkImage = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      logger.info('Uploading drink image', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
        filename: file.filename,
      });

      // Create the image URL (adjust this based on your server setup)
      const imageUrl = `/uploads/${file.filename}`;

      const drink = await this.drinksService.uploadDrinkImage(id, imageUrl);

      if (!drink) {
        res.status(404).json({ error: 'Drink not found' });
        return;
      }

      res.json({
        message: 'Image uploaded successfully',
        drink,
        imageUrl,
      });
    } catch (error) {
      logger.error('Error uploading drink image', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
