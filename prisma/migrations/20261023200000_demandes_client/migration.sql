-- AlterTable
ALTER TABLE `DemandeContact` ADD COLUMN `clientId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `DemandeContact_clientId_idx` ON `DemandeContact`(`clientId`);

-- AddForeignKey
ALTER TABLE `DemandeContact` ADD CONSTRAINT `DemandeContact_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

