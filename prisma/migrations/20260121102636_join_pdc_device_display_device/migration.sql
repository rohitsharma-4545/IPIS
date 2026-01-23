-- CreateIndex
CREATE INDEX "DisplayDevice_vendor_idx" ON "DisplayDevice"("vendor");

-- CreateIndex
CREATE INDEX "DisplayDevice_pf_idx" ON "DisplayDevice"("pf");

-- CreateIndex
CREATE INDEX "PdcDevice_vendor_idx" ON "PdcDevice"("vendor");

-- CreateIndex
CREATE INDEX "PdcDevice_pf_idx" ON "PdcDevice"("pf");

-- CreateIndex
CREATE INDEX "Train_pno_idx" ON "Train"("pno");

-- AddForeignKey
ALTER TABLE "DisplayDevice" ADD CONSTRAINT "DisplayDevice_pf_fkey" FOREIGN KEY ("pf") REFERENCES "PdcDevice"("pf") ON DELETE CASCADE ON UPDATE CASCADE;
