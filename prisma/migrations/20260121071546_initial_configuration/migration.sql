-- CreateTable
CREATE TABLE "PdcDevice" (
    "id" SERIAL NOT NULL,
    "vendor" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "pf" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PdcDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Train" (
    "id" SERIAL NOT NULL,
    "tno" TEXT NOT NULL,
    "tne" TEXT NOT NULL,
    "tnh" TEXT NOT NULL,
    "tnr" TEXT NOT NULL,
    "adf" TEXT NOT NULL,
    "sat" TEXT NOT NULL,
    "sdt" TEXT NOT NULL,
    "pno" TEXT NOT NULL,
    "sta" TEXT NOT NULL,
    "ccd" TEXT NOT NULL,
    "colors" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Train_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineConfig" (
    "id" SERIAL NOT NULL,
    "int" INTEGER NOT NULL,
    "pto" INTEGER NOT NULL,
    "dtp" INTEGER NOT NULL,
    "chr" INTEGER NOT NULL,
    "eff" INTEGER NOT NULL,
    "spd" INTEGER NOT NULL,
    "vid" TEXT,
    "img" TEXT,
    "tod" TEXT NOT NULL,
    "rst" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LineConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisplayDevice" (
    "id" SERIAL NOT NULL,
    "vendor" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "pf" TEXT NOT NULL,
    "int" INTEGER NOT NULL,
    "hsr" TEXT NOT NULL,
    "lastPoll" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisplayDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PdcDevice_ip_key" ON "PdcDevice"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "PdcDevice_pf_key" ON "PdcDevice"("pf");

-- CreateIndex
CREATE UNIQUE INDEX "Train_tno_key" ON "Train"("tno");

-- CreateIndex
CREATE UNIQUE INDEX "DisplayDevice_ip_key" ON "DisplayDevice"("ip");
