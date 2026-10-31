-- CreateTable
CREATE TABLE `Demarche` (
    `id` VARCHAR(191) NOT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `plateforme` ENUM('E_MECEF', 'E_SERVICES', 'PERFECTO', 'MONENTREPRISE', 'AUTRE') NOT NULL,
    `objet` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NULL,
    `montant` DECIMAL(15, 2) NULL,
    `statut` ENUM('A_FAIRE', 'EN_COURS', 'TERMINEE') NOT NULL DEFAULT 'A_FAIRE',
    `dateDemarche` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Demarche_clientId_dateDemarche_idx`(`clientId`, `dateDemarche`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Demarche` ADD CONSTRAINT `Demarche_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
