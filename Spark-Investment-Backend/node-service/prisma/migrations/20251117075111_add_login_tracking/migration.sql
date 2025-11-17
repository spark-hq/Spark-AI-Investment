-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lock_until" TIMESTAMP(3),
ADD COLUMN     "login_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refresh_token" TEXT;
