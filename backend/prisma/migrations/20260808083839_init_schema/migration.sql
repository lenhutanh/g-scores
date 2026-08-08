-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7');

-- CreateEnum
CREATE TYPE "SubjectCode" AS ENUM ('math', 'literature', 'foreign_language', 'physics', 'chemistry', 'biology', 'history', 'geography', 'civics');

-- CreateTable
CREATE TABLE "Candidate" (
    "id" SERIAL NOT NULL,
    "registrationNo" VARCHAR(8) NOT NULL,
    "languageCode" "LanguageCode",

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" "SubjectCode" NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "candidateId" INTEGER NOT NULL,
    "subjectId" "SubjectCode" NOT NULL,
    "score" DECIMAL(4,2) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("candidateId","subjectId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_registrationNo_key" ON "Candidate"("registrationNo");

-- CreateIndex
CREATE INDEX "Score_subjectId_score_idx" ON "Score"("subjectId", "score");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
