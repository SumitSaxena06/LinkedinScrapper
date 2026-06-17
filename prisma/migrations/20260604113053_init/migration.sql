-- CreateTable
CREATE TABLE "SeenJob" (
    "jobId" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'linkedin',
    "seenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
