-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email_verified_at` DATETIME(3) NULL,
    `remember_token` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `branches` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lokasis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `branch_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'belum',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lokasi_id` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `contract_number` VARCHAR(191) NULL,
    `purchase_order_number` VARCHAR(191) NULL,
    `branch_id` INTEGER NULL,
    `implementer` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `user_id` INTEGER NULL,
    `waspang_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `projects_lokasi_id_key`(`lokasi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commissioning_tests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lokasi_id` INTEGER NOT NULL,
    `personel_id` INTEGER NULL,
    `tanggal` DATETIME(3) NULL,
    `kota_ttd` VARCHAR(191) NULL,
    `status_pekerjaan` VARCHAR(191) NULL,
    `status_hasil` VARCHAR(191) NULL,
    `status_kelayakan` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `commissioning_tests_lokasi_id_key`(`lokasi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `commissioning_test_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commissioning_test_id` INTEGER NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `boq_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lokasi_id` INTEGER NOT NULL,
    `kode_item` VARCHAR(191) NULL,
    `nama_item` VARCHAR(191) NULL,
    `satuan` VARCHAR(191) NULL,
    `volume` DOUBLE NULL,
    `keterangan` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marking_kabels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lokasi_id` INTEGER NOT NULL,
    `jenis_kabel` VARCHAR(191) NULL,
    `panjang_meter` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foto_lampiran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lokasi_id` INTEGER NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NULL,
    `kategori` VARCHAR(191) NULL,
    `urutan` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `opm_records` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lokasi_id` INTEGER NOT NULL,
    `odp_name` VARCHAR(191) NULL,
    `port_1` VARCHAR(191) NULL,
    `port_2` VARCHAR(191) NULL,
    `port_3` VARCHAR(191) NULL,
    `port_4` VARCHAR(191) NULL,
    `port_5` VARCHAR(191) NULL,
    `port_6` VARCHAR(191) NULL,
    `port_7` VARCHAR(191) NULL,
    `port_8` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otdr_files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lokasi_id` INTEGER NOT NULL,
    `odp_name` VARCHAR(191) NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `generate_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lokasi_id` INTEGER NOT NULL,
    `generated_by` VARCHAR(191) NULL,
    `generated_at` DATETIME(3) NULL,
    `file_path` VARCHAR(191) NULL,
    `versi` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lokasis` ADD CONSTRAINT `lokasis_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lokasis` ADD CONSTRAINT `lokasis_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasis`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_branch_id_fkey` FOREIGN KEY (`branch_id`) REFERENCES `branches`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_waspang_id_fkey` FOREIGN KEY (`waspang_id`) REFERENCES `personels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commissioning_tests` ADD CONSTRAINT `commissioning_tests_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasis`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commissioning_tests` ADD CONSTRAINT `commissioning_tests_personel_id_fkey` FOREIGN KEY (`personel_id`) REFERENCES `personels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `commissioning_test_images` ADD CONSTRAINT `commissioning_test_images_commissioning_test_id_fkey` FOREIGN KEY (`commissioning_test_id`) REFERENCES `commissioning_tests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `boq_items` ADD CONSTRAINT `boq_items_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `marking_kabels` ADD CONSTRAINT `marking_kabels_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foto_lampiran` ADD CONSTRAINT `foto_lampiran_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `opm_records` ADD CONSTRAINT `opm_records_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otdr_files` ADD CONSTRAINT `otdr_files_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `generate_logs` ADD CONSTRAINT `generate_logs_lokasi_id_fkey` FOREIGN KEY (`lokasi_id`) REFERENCES `lokasis`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
