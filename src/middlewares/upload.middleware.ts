import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';

// Configure storage for local file system
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `drink-${uniqueSuffix}${ext}`);
  },
});

// Configure memory storage (for cloud uploads)
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

// Local storage upload middleware
export const uploadToLocal = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Memory storage upload middleware (for cloud services)
export const uploadToMemory = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

// Single file upload middleware
export const uploadSingle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadToLocal.single('image')(req, res, next);
};

// Multiple files upload middleware
export const uploadMultiple = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadToLocal.array('images', 5)(req, res, next);
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
        message: 'File size must be less than 5MB',
      });
      return;
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      res.status(400).json({
        error: 'Too many files',
        message: 'Maximum 5 files allowed',
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
