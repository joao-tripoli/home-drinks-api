import { Router } from 'express';
import { CloudUploadController } from '../controllers/cloud-upload.controller';
import {
  handleUploadError,
  uploadSingle,
} from '../middlewares/upload.middleware';

const router: Router = Router();
const cloudUploadController = new CloudUploadController();

// Upload drink image to Uploadcare
router.post(
  '/drinks/:id/image',
  uploadSingle,
  handleUploadError,
  cloudUploadController.uploadToUploadcare
);

// Get file metadata
router.get('/files/:fileId', cloudUploadController.getFileMetadata);

// Get files by user
router.get('/files', cloudUploadController.getFilesByUser);

// Delete file metadata
router.delete('/files/:fileId', cloudUploadController.deleteFileMetadata);

export default router;
