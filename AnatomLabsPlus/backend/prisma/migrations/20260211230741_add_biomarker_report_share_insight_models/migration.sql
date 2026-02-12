-- CreateTable
CREATE TABLE "biomarker_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "value2" DOUBLE PRECISION,
    "unit" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "biomarker_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_shares" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "accessCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insight_caches" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insight_caches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "biomarker_logs_userId_type_date_idx" ON "biomarker_logs"("userId", "type", "date");

-- CreateIndex
CREATE UNIQUE INDEX "report_shares_shareToken_key" ON "report_shares"("shareToken");

-- CreateIndex
CREATE UNIQUE INDEX "insight_caches_userId_type_key" ON "insight_caches"("userId", "type");

-- AddForeignKey
ALTER TABLE "biomarker_logs" ADD CONSTRAINT "biomarker_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_shares" ADD CONSTRAINT "report_shares_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insight_caches" ADD CONSTRAINT "insight_caches_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
