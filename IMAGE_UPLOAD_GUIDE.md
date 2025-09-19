# Image Upload with Prisma - Complete Guide

This guide shows you how to implement image upload functionality with Prisma in your Node.js/Express application.

## 🚀 Quick Start

### 1. Local File Upload (Current Implementation)

**Upload an image to a drink:**

```bash
curl -X POST http://localhost:3000/api/drinks/{drinkId}/image \
  -F "image=@/path/to/your/image.jpg"
```

**Response:**

```json
{
  "message": "Image uploaded successfully",
  "drink": {
    "id": "drink_id",
    "name": "Mojito",
    "imageUrl": "/uploads/drink-1234567890-123456789.jpg"
    // ... other drink fields
  },
  "imageUrl": "/uploads/drink-1234567890-123456789.jpg"
}
```

### 2. Access Uploaded Images

Images are served statically at: `http://localhost:3000/uploads/{filename}`

## 📁 File Structure

```
src/
├── middlewares/
│   └── upload.middleware.ts     # Multer configuration
├── controllers/
│   ├── drinks.controller.ts     # Main upload endpoint
│   └── cloud-upload.controller.ts # Cloud storage examples
├── services/
│   ├── drinks.service.ts        # Business logic
│   └── cloud-storage.service.ts # Cloud storage implementations
└── routes/
    └── drinks.routes.ts         # Route definitions
```

## 🔧 Configuration

### Environment Variables

For cloud storage, add these to your `.env` file:

```env
# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_KEY_FILE=path/to/service-account.json

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_ACCOUNT=your_storage_account
```

## 🌐 Cloud Storage Options

### AWS S3

1. Install dependencies:

```bash
pnpm add @aws-sdk/client-s3
```

2. Uncomment the S3 code in `cloud-storage.service.ts`

3. Use the endpoint:

```bash
curl -X POST http://localhost:3000/api/drinks/{drinkId}/image/s3 \
  -F "image=@/path/to/your/image.jpg"
```

### Google Cloud Storage

1. Install dependencies:

```bash
pnpm add @google-cloud/storage
```

2. Uncomment the GCS code in `cloud-storage.service.ts`

3. Use the endpoint:

```bash
curl -X POST http://localhost:3000/api/drinks/{drinkId}/image/gcs \
  -F "image=@/path/to/your/image.jpg"
```

### Cloudinary

1. Install dependencies:

```bash
pnpm add cloudinary
```

2. Uncomment the Cloudinary code in `cloud-storage.service.ts`

3. Use the endpoint:

```bash
curl -X POST http://localhost:3000/api/drinks/{drinkId}/image/cloudinary \
  -F "image=@/path/to/your/image.jpg"
```

### Azure Blob Storage

1. Install dependencies:

```bash
pnpm add @azure/storage-blob
```

2. Uncomment the Azure code in `cloud-storage.service.ts`

3. Use the endpoint:

```bash
curl -X POST http://localhost:3000/api/drinks/{drinkId}/image/azure \
  -F "image=@/path/to/your/image.jpg"
```

## 📝 Prisma Schema

Your current schema already supports image URLs:

```prisma
model Drink {
  id          String   @id @default(cuid())
  name        String
  description String?
  category    String
  ingredients String[]
  instructions String
  imageUrl    String?  // This field stores the image URL
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("drinks")
}
```

## 🛡️ Security Considerations

1. **File Type Validation**: Only image files (jpeg, jpg, png, gif, webp) are allowed
2. **File Size Limits**: Maximum 5MB per file
3. **Unique Filenames**: Timestamps and random numbers prevent conflicts
4. **Error Handling**: Comprehensive error handling for upload failures

## 🔄 Frontend Integration

### JavaScript/TypeScript

```javascript
const uploadImage = async (drinkId, file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`/api/drinks/${drinkId}/image`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return result;
};

// Usage
const fileInput = document.getElementById('imageInput');
const file = fileInput.files[0];
const result = await uploadImage('drink_id', file);
console.log('Image URL:', result.imageUrl);
```

### React Example

```jsx
import { useState } from 'react';

const ImageUpload = ({ drinkId }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/drinks/${drinkId}/image`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setImageUrl(result.imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Drink" />}
    </div>
  );
};
```

## 🚨 Error Handling

The implementation includes comprehensive error handling:

- **File too large**: Returns 400 with size limit message
- **Invalid file type**: Returns 400 with allowed types message
- **No file provided**: Returns 400 with error message
- **Drink not found**: Returns 404
- **Upload failures**: Returns 500 with error details

## 📊 Database Operations

The image URL is stored in the `imageUrl` field of the `Drink` model:

```typescript
// Update drink with image URL
const drink = await prisma.drink.update({
  where: { id: drinkId },
  data: { imageUrl: 'https://example.com/image.jpg' },
});
```

## 🔧 Customization

### Change Upload Directory

Modify the destination in `upload.middleware.ts`:

```typescript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'custom-uploads/'); // Change this path
  },
  // ...
});
```

### Adjust File Size Limits

```typescript
const uploadSingle = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB instead of 5MB
  },
  // ...
});
```

### Add More File Types

```typescript
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/; // Add svg
  // ...
};
```

## 🎯 Best Practices

1. **Use Cloud Storage for Production**: Local storage is fine for development, but use cloud storage for production
2. **Implement Image Optimization**: Consider using libraries like `sharp` for image resizing
3. **Add Image Validation**: Validate image dimensions, aspect ratios, etc.
4. **Implement Cleanup**: Delete old images when drinks are deleted
5. **Use CDN**: Serve images through a CDN for better performance
6. **Add Authentication**: Protect upload endpoints with authentication
7. **Rate Limiting**: Implement rate limiting for upload endpoints

## 🐛 Troubleshooting

### Common Issues

1. **"ENOENT: no such file or directory"**: Make sure the uploads directory exists
2. **"File too large"**: Check your file size limits
3. **"Only image files are allowed"**: Verify file type and MIME type
4. **Images not loading**: Check static file serving configuration

### Debug Mode

Enable debug logging by setting the log level in your logger configuration.

## 📚 Additional Resources

- [Multer Documentation](https://github.com/expressjs/multer)
- [Prisma Documentation](https://www.prisma.io/docs)
- [AWS S3 SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [Google Cloud Storage](https://cloud.google.com/storage/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Azure Blob Storage](https://docs.microsoft.com/en-us/azure/storage/blobs/)
