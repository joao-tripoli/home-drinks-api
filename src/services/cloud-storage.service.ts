import { config } from '@/config/environment';
import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';
import { uploadFile } from '@uploadcare/upload-client';

export interface UploadcareResult {
  uuid: string;
  cdnUrl: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

export class CloudStorageService {
  // Upload to Uploadcare
  public static async uploadToUploadcare(
    file: Express.Multer.File,
    userId: string
  ): Promise<UploadcareResult> {
    try {
      logger.info('Uploading file to Uploadcare', {
        filename: file.originalname,
        size: file.size,
        userId,
      });

      // Upload file to Uploadcare
      const result = await uploadFile(file.buffer, {
        publicKey: config.UPLOADCARE_PUBLIC_KEY,
        fileName: file.originalname,
        contentType: file.mimetype,
      });

      // Store metadata in database
      const uploadcareFile = await prisma.uploadcareFile.create({
        data: {
          fileId: result.uuid,
          fileUrl: result.cdnUrl || '',
          userId: userId,
          fileName: file.originalname,
          fileSize: file.size,
          contentType: file.mimetype,
        },
      });

      logger.info('File uploaded to Uploadcare successfully', {
        fileId: result.uuid,
        cdnUrl: result.cdnUrl,
        userId,
        uploadcareFileId: uploadcareFile.id,
      });

      return {
        uuid: result.uuid,
        cdnUrl: result.cdnUrl || '',
        fileName: file.originalname,
        fileSize: file.size,
        contentType: file.mimetype,
      };
    } catch (error) {
      logger.error('Uploadcare upload error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        filename: file.originalname,
        userId,
      });
      throw new Error('Failed to upload to Uploadcare');
    }
  }

  // Get file metadata by file ID
  public static async getFileMetadata(fileId: string) {
    try {
      const file = await prisma.uploadcareFile.findUnique({
        where: { fileId },
      });

      return file;
    } catch (error) {
      logger.error('Error retrieving file metadata', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fileId,
      });
      throw new Error('Failed to retrieve file metadata');
    }
  }

  // Get files by user ID
  public static async getFilesByUserId(userId: string) {
    try {
      const files = await prisma.uploadcareFile.findMany({
        where: { userId },
        orderBy: { uploadTimestamp: 'desc' },
      });

      return files;
    } catch (error) {
      logger.error('Error retrieving files by user ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw new Error('Failed to retrieve files');
    }
  }

  // Delete file metadata (note: this doesn't delete from Uploadcare, just the metadata)
  public static async deleteFileMetadata(fileId: string) {
    try {
      const deletedFile = await prisma.uploadcareFile.delete({
        where: { fileId },
      });

      logger.info('File metadata deleted', {
        fileId,
        uploadcareFileId: deletedFile.id,
      });

      return deletedFile;
    } catch (error) {
      logger.error('Error deleting file metadata', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fileId,
      });
      throw new Error('Failed to delete file metadata');
    }
  }
}
