-- CreateTable
CREATE TABLE "uploadcare_files" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" TEXT,
    "file_size" INTEGER,
    "content_type" TEXT,
    "upload_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "uploadcare_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploadcare_files_file_id_key" ON "uploadcare_files"("file_id");
