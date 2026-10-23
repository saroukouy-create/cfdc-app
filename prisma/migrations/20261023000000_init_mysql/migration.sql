-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'CONSEILLER', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` VARCHAR(191) NOT NULL,
    `raisonSociale` VARCHAR(191) NOT NULL,
    `formeJuridique` VARCHAR(191) NULL,
    `secteurActivite` VARCHAR(191) NULL,
    `chiffreAffaires` DOUBLE NULL,
    `telephone` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `ifu` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Client_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dossier` (
    `id` VARCHAR(191) NOT NULL,
    `denomination` VARCHAR(191) NOT NULL,
    `activite` VARCHAR(191) NULL,
    `formeJuridique` VARCHAR(191) NULL,
    `capital` DOUBLE NULL,
    `siege` VARCHAR(191) NULL,
    `etape` ENUM('INFORMATIONS', 'FORME_JURIDIQUE', 'PIECES', 'DEPOT', 'SUIVI') NOT NULL DEFAULT 'INFORMATIONS',
    `statut` ENUM('EN_COURS', 'DEPOSE', 'TERMINE', 'ABANDONNE') NOT NULL DEFAULT 'EN_COURS',
    `dateDepot` DATETIME(3) NULL,
    `numeroRccm` VARCHAR(191) NULL,
    `notes` TEXT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Piece` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `chemin` VARCHAR(191) NOT NULL,
    `taille` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `dossierId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ecriture` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `journal` VARCHAR(191) NOT NULL,
    `piece` VARCHAR(191) NULL,
    `compte` VARCHAR(191) NOT NULL,
    `libelle` VARCHAR(191) NOT NULL,
    `debit` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `credit` DECIMAL(15, 2) NOT NULL DEFAULT 0,
    `clientId` VARCHAR(191) NOT NULL,

    INDEX `Ecriture_clientId_date_idx`(`clientId`, `date`),
    INDEX `Ecriture_clientId_compte_idx`(`clientId`, `compte`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DemandeService` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('ATTESTATION_FISCALE', 'ATTESTATION_CNSS', 'CERTIFICAT_NON_FAILLITE', 'ATTESTATION_DOMICILIATION_FISCALE', 'QUITUS_FISCAL', 'INVENTAIRE', 'DECLARATION_IMPOTS', 'PAIE_DECLARATIONS_SOCIALES', 'FORMATION', 'AUTRE') NOT NULL,
    `description` TEXT NULL,
    `statut` ENUM('NOUVELLE', 'EN_COURS', 'PRETE', 'LIVREE', 'REJETEE') NOT NULL DEFAULT 'NOUVELLE',
    `reponse` TEXT NULL,
    `clientId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dossier` ADD CONSTRAINT `Dossier_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Piece` ADD CONSTRAINT `Piece_dossierId_fkey` FOREIGN KEY (`dossierId`) REFERENCES `Dossier`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ecriture` ADD CONSTRAINT `Ecriture_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DemandeService` ADD CONSTRAINT `DemandeService_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

