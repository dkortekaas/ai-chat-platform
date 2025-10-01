-- CreateEnum
CREATE TYPE "WebsiteStatus" AS ENUM ('PENDING', 'SYNCING', 'COMPLETED', 'ERROR');

-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "pages" INTEGER NOT NULL DEFAULT 0,
    "syncSpeed" DOUBLE PRECISION DEFAULT 0,
    "syncInterval" TEXT NOT NULL DEFAULT 'never',
    "lastSync" TIMESTAMP(3),
    "status" "WebsiteStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "websites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "websites_url_key" ON "websites"("url");

-- CreateIndex
CREATE INDEX "websites_status_idx" ON "websites"("status");

-- CreateIndex
CREATE INDEX "websites_createdAt_idx" ON "websites"("createdAt");
