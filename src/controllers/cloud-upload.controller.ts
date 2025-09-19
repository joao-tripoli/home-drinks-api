import { Request, Response } from 'express';
import { CloudStorageService } from '../services/cloud-storage.service';
import { DrinksService } from '../services/drinks.service';
import { logger } from '../utils/logger';

export class CloudUploadController {
  private drinksService: DrinksService;

  constructor() {
    this.drinksService = new DrinksService();
  }

  // Example: Upload to AWS S3
  public uploadToS3 = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      logger.info('Uploading drink image to S3', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
        filename: file.originalname,
      });

      const imageUrl = await CloudStorageService.uploadToS3(
        file,
        'your-bucket-name'
      );
      const drink = await this.drinksService.uploadDrinkImage(id, imageUrl);

      if (!drink) {
        res.status(404).json({ error: 'Drink not found' });
        return;
      }

      res.json({
        message: 'Image uploaded to S3 successfully',
        drink,
        imageUrl,
      });
    } catch (error) {
      logger.error('Error uploading drink image to S3', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Example: Upload to Google Cloud Storage
  public uploadToGCS = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      logger.info('Uploading drink image to GCS', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
        filename: file.originalname,
      });

      const imageUrl = await CloudStorageService.uploadToGCS(
        file,
        'your-bucket-name'
      );
      const drink = await this.drinksService.uploadDrinkImage(id, imageUrl);

      if (!drink) {
        res.status(404).json({ error: 'Drink not found' });
        return;
      }

      res.json({
        message: 'Image uploaded to GCS successfully',
        drink,
        imageUrl,
      });
    } catch (error) {
      logger.error('Error uploading drink image to GCS', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Example: Upload to Cloudinary
  public uploadToCloudinary = async (
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

      logger.info('Uploading drink image to Cloudinary', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
        filename: file.originalname,
      });

      const imageUrl = await CloudStorageService.uploadToCloudinary(file);
      const drink = await this.drinksService.uploadDrinkImage(id, imageUrl);

      if (!drink) {
        res.status(404).json({ error: 'Drink not found' });
        return;
      }

      res.json({
        message: 'Image uploaded to Cloudinary successfully',
        drink,
        imageUrl,
      });
    } catch (error) {
      logger.error('Error uploading drink image to Cloudinary', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Example: Upload to Azure Blob Storage
  public uploadToAzure = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const file = req.file;

      if (!file) {
        res.status(400).json({ error: 'No image file provided' });
        return;
      }

      logger.info('Uploading drink image to Azure', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
        filename: file.originalname,
      });

      const imageUrl = await CloudStorageService.uploadToAzure(
        file,
        'your-container-name'
      );
      const drink = await this.drinksService.uploadDrinkImage(id, imageUrl);

      if (!drink) {
        res.status(404).json({ error: 'Drink not found' });
        return;
      }

      res.json({
        message: 'Image uploaded to Azure successfully',
        drink,
        imageUrl,
      });
    } catch (error) {
      logger.error('Error uploading drink image to Azure', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
