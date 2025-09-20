import { getAuth } from '@clerk/express';
import { Request, Response } from 'express';
import { CloudStorageService } from '../services/cloud-storage.service';
import { DrinksService } from '../services/drinks.service';
import { logger } from '../utils/logger';

export class CloudUploadController {
  private drinksService: DrinksService;

  constructor() {
    this.drinksService = new DrinksService();
  }

  // Upload to Uploadcare
  public uploadToUploadcare = async (
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

      const { userId } = getAuth(req);

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      logger.info('Uploading drink image to Uploadcare', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        drinkId: id,
        filename: file.originalname,
        userId,
      });

      const result = await CloudStorageService.uploadToUploadcare(file, userId);
      const drink = await this.drinksService.uploadDrinkImage(
        id,
        result.cdnUrl
      );

      if (!drink) {
        res.status(404).json({ error: 'Drink not found' });
        return;
      }

      res.json({
        message: 'Image uploaded to Uploadcare successfully',
        drink,
        imageUrl: result.cdnUrl,
        fileId: result.uuid,
      });
    } catch (error) {
      logger.error('Error uploading drink image to Uploadcare', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: req.params.id,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get file metadata
  public getFileMetadata = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { fileId } = req.params;

      const fileMetadata = await CloudStorageService.getFileMetadata(fileId);

      if (!fileMetadata) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      res.json({
        file: fileMetadata,
      });
    } catch (error) {
      logger.error('Error retrieving file metadata', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fileId: req.params.fileId,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get files by user
  public getFilesByUser = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const files = await CloudStorageService.getFilesByUserId(userId);

      res.json({
        files,
        count: files.length,
      });
    } catch (error) {
      logger.error('Error retrieving files by user', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Delete file metadata
  public deleteFileMetadata = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { fileId } = req.params;

      const deletedFile = await CloudStorageService.deleteFileMetadata(fileId);

      res.json({
        message: 'File metadata deleted successfully',
        file: deletedFile,
      });
    } catch (error) {
      logger.error('Error deleting file metadata', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fileId: req.params.fileId,
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
