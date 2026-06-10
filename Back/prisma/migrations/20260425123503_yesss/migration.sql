/*
  Warnings:

  - You are about to drop the column `attachment` on the `announcement` table. All the data in the column will be lost.
  - You are about to drop the column `className` on the `announcement` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `announcement` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `announcement` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `announcement` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `course` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `department` table. All the data in the column will be lost.
  - You are about to drop the column `classSection` on the `enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `courseId` on the `enrollment` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `className` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `user` table. All the data in the column will be lost.
  - The values [TEACHER] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `teacher` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,classId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[studentNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `Announcement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Made the column `code` on table `department` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `classId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `announcement` DROP FOREIGN KEY `Announcement_teacherId_fkey`;

-- DropForeignKey
ALTER TABLE `enrollment` DROP FOREIGN KEY `Enrollment_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `enrollment` DROP FOREIGN KEY `Enrollment_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_id_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_departmentId_fkey`;

-- DropForeignKey
ALTER TABLE `teacher` DROP FOREIGN KEY `Teacher_id_fkey`;

-- DropIndex
DROP INDEX `Announcement_teacherId_departmentId_idx` ON `announcement`;

-- DropIndex
DROP INDEX `Enrollment_courseId_fkey` ON `enrollment`;

-- DropIndex
DROP INDEX `Enrollment_studentId_courseId_key` ON `enrollment`;

-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `announcement` DROP COLUMN `attachment`,
    DROP COLUMN `className`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `teacherId`,
    DROP COLUMN `year`,
    ADD COLUMN `authorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `course` DROP COLUMN `name`,
    DROP COLUMN `year`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `creditHours` INTEGER NOT NULL DEFAULT 3,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `department` DROP COLUMN `deletedAt`,
    MODIFY `code` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `enrollment` DROP COLUMN `classSection`,
    DROP COLUMN `courseId`,
    ADD COLUMN `classId` INTEGER NOT NULL,
    ADD COLUMN `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `news` DROP COLUMN `deletedAt`,
    DROP COLUMN `imageUrl`,
    ADD COLUMN `authorId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `className`,
    DROP COLUMN `fullName`,
    DROP COLUMN `year`,
    ADD COLUMN `studentNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD COLUMN `yearLevel` INTEGER NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `deletedAt`,
    DROP COLUMN `username`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastName` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('GUEST', 'STUDENT', 'LECTURER', 'ADMIN') NOT NULL;

-- DropTable
DROP TABLE `teacher`;

-- CreateTable
CREATE TABLE `Lecturer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `rank` ENUM('ASSISTANT', 'LECTURER', 'HEAD_OF_DEPARTMENT') NOT NULL DEFAULT 'LECTURER',
    `departmentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Lecturer_userId_key`(`userId`),
    UNIQUE INDEX `Lecturer_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassOffering` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `courseId` INTEGER NOT NULL,
    `lecturerId` INTEGER NULL,
    `semester` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `room` VARCHAR(191) NULL,
    `schedule` VARCHAR(191) NULL,
    `capacity` INTEGER NOT NULL DEFAULT 40,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assignment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `classId` INTEGER NOT NULL,
    `lecturerId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `dueDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assignmentId` INTEGER NOT NULL,
    `enrollmentId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `score` DECIMAL(5, 2) NOT NULL,
    `feedback` VARCHAR(191) NULL,
    `gradedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gradedById` INTEGER NULL,

    UNIQUE INDEX `Grade_assignmentId_enrollmentId_key`(`assignmentId`, `enrollmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FileUpload` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `originalName` VARCHAR(191) NOT NULL,
    `storedName` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `extension` VARCHAR(191) NULL,
    `size` INTEGER NOT NULL,
    `relationType` ENUM('ASSIGNMENT', 'ANNOUNCEMENT', 'NEWS', 'SUBMISSION', 'PROFILE', 'OTHER') NOT NULL,
    `relationId` INTEGER NULL,
    `uploadedById` INTEGER NULL,
    `assignmentId` INTEGER NULL,
    `announcementId` INTEGER NULL,
    `newsId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Enrollment_studentId_classId_key` ON `Enrollment`(`studentId`, `classId`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_userId_key` ON `Student`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Student_studentNumber_key` ON `Student`(`studentNumber`);

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecturer` ADD CONSTRAINT `Lecturer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lecturer` ADD CONSTRAINT `Lecturer_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassOffering` ADD CONSTRAINT `ClassOffering_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassOffering` ADD CONSTRAINT `ClassOffering_lecturerId_fkey` FOREIGN KEY (`lecturerId`) REFERENCES `Lecturer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Enrollment` ADD CONSTRAINT `Enrollment_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `ClassOffering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `ClassOffering`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignment` ADD CONSTRAINT `Assignment_lecturerId_fkey` FOREIGN KEY (`lecturerId`) REFERENCES `Lecturer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_enrollmentId_fkey` FOREIGN KEY (`enrollmentId`) REFERENCES `Enrollment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `News` ADD CONSTRAINT `News_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileUpload` ADD CONSTRAINT `FileUpload_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileUpload` ADD CONSTRAINT `FileUpload_assignmentId_fkey` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileUpload` ADD CONSTRAINT `FileUpload_announcementId_fkey` FOREIGN KEY (`announcementId`) REFERENCES `Announcement`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FileUpload` ADD CONSTRAINT `FileUpload_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `News`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
