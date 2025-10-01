-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'ERROR');

-- CreateTable
CREATE TABLE "knowledge_files" (
    "id" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "status" "FileStatus" NOT NULL DEFAULT 'PROCESSING',
    "errorMessage" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "knowledge_files_status_idx" ON "knowledge_files"("status");

-- CreateIndex
CREATE INDEX "knowledge_files_enabled_idx" ON "knowledge_files"("enabled");

-- CreateIndex
CREATE INDEX "knowledge_files_createdAt_idx" ON "knowledge_files"("createdAt");
