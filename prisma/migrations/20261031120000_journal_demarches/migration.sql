-- CreateTable
CREATE TABLE `JournalDemarche` (
    `id` VARCHAR(191) NOT NULL,
    `demarcheId` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `action` ENUM('CREATION', 'STATUT', 'SUPPRESSION') NOT NULL,
    `acteur` VARCHAR(191) NOT NULL,
    `acteurId` VARCHAR(191) NULL,
    `detail` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `JournalDemarche_clientId_createdAt_idx`(`clientId`, `createdAt`),
    INDEX `JournalDemarche_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JournalDemarche` ADD CONSTRAINT `JournalDemarche_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
