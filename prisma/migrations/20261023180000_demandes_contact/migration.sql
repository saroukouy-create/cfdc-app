-- CreateTable
CREATE TABLE `DemandeContact` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('DEVIS', 'FORMATION', 'MESSAGE') NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `entreprise` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `telephone` VARCHAR(191) NULL,
    `sujet` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `statut` ENUM('NOUVEAU', 'CONTACTE', 'CONVERTI', 'CLOS') NOT NULL DEFAULT 'NOUVEAU',
    `note` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DemandeContact_statut_createdAt_idx`(`statut`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

