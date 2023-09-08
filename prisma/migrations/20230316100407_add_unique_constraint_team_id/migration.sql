/*
  Warnings:

  - A unique constraint covering the columns `[id,slackTeamId]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "teams_id_slackTeamId_key" ON "teams"("id", "slackTeamId");
