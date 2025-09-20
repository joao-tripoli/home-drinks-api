import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Configure memory storage for Uploadcare (since we upload directly to cloud)
const memoryStorage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Memory storage upload middleware (for Uploadcare)
export const uploadToMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (Uploadcare supports larger files)
  },
  fileFilter: fileFilter,
});

// Single file upload middleware for Uploadcare
export const uploadSingle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadToMemory.single('image')(req, res, next);
};

// Multiple files upload middleware for Uploadcare
export const uploadMultiple = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadToMemory.array('images', 10)(req, res, next); // Increased limit for Uploadcare
};

// Error handling middleware for multer
export const handleUploadError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: 'File too large',
        message: 'File size must be less than 10MB',
      });
      return;
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        error: 'Too many files',
        message: 'Maximum 10 files allowed',
      });
      return;
    }
  }

  if (error.message === 'Only image files are allowed!') {
    res.status(400).json({
      error: 'Invalid file type',
      message: 'Only image files (jpeg, jpg, png, gif, webp) are allowed',
    });
    return;
  }

  logger.error('Upload error', { error: error.message });
  next(error);
};
