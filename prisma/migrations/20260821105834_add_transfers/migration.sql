-- CreateTable
CREATE TABLE "Transfer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transfer_userId_idx" ON "Transfer"("userId");

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
