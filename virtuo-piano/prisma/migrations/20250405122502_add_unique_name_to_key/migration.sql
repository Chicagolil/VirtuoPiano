/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Key` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Key_name_key" ON "Key"("name");
