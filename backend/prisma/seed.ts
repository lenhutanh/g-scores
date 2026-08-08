import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  SubjectCode,
  LanguageCode,
} from '../src/generated/prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

type CsvRow = {
  sbd: string;
  toan?: string;
  ngu_van?: string;
  ngoai_ngu?: string;
  vat_li?: string;
  hoa_hoc?: string;
  sinh_hoc?: string;
  lich_su?: string;
  dia_li?: string;
  gdcd?: string;
  ma_ngoai_ngu?: string;
};

const SUBJECT_MAPPING: {
  csvKey: keyof Omit<CsvRow, 'sbd' | 'ma_ngoai_ngu'>;
  code: SubjectCode;
}[] = [
  { csvKey: 'toan', code: SubjectCode.math },
  { csvKey: 'ngu_van', code: SubjectCode.literature },
  { csvKey: 'ngoai_ngu', code: SubjectCode.foreign_language },
  { csvKey: 'vat_li', code: SubjectCode.physics },
  { csvKey: 'hoa_hoc', code: SubjectCode.chemistry },
  { csvKey: 'sinh_hoc', code: SubjectCode.biology },
  { csvKey: 'lich_su', code: SubjectCode.history },
  { csvKey: 'dia_li', code: SubjectCode.geography },
  { csvKey: 'gdcd', code: SubjectCode.civics },
];

const SUBJECTS_INFO = [
  { id: SubjectCode.math, name: 'Mathematics' },
  { id: SubjectCode.literature, name: 'Literature' },
  { id: SubjectCode.foreign_language, name: 'Foreign Language' },
  { id: SubjectCode.physics, name: 'Physics' },
  { id: SubjectCode.chemistry, name: 'Chemistry' },
  { id: SubjectCode.biology, name: 'Biology' },
  { id: SubjectCode.history, name: 'History' },
  { id: SubjectCode.geography, name: 'Geography' },
  { id: SubjectCode.civics, name: 'Civic Education' },
];

async function main() {
  console.log('Seeding subjects...');
  await prisma.subject.createMany({
    data: SUBJECTS_INFO,
    skipDuplicates: true,
  });

  const csvFilePath = path.join(__dirname, '../data', 'diem_thi_thpt_2024.csv');
  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  async function processBatch(currentBatch: CsvRow[]) {
    if (currentBatch.length === 0) return;

    await prisma.$transaction(
      async (tx) => {
        const candidatesData = currentBatch.map((row) => ({
          registrationNo: row.sbd,
          languageCode: (row.ma_ngoai_ngu?.trim() as LanguageCode) || null,
        }));

        await tx.candidate.createMany({
          data: candidatesData,
        });

        const registrationNos = currentBatch.map((row) => row.sbd);
        const insertedCandidates = await tx.candidate.findMany({
          where: { registrationNo: { in: registrationNos } },
          select: { id: true, registrationNo: true },
        });

        const sbdToIdMap = new Map<string, number>(
          insertedCandidates.map((c) => [c.registrationNo, c.id]),
        );

        const scoresData: {
          candidateId: number;
          subjectId: SubjectCode;
          score: number;
        }[] = [];
        for (const row of currentBatch) {
          const candidateId = sbdToIdMap.get(row.sbd);
          if (!candidateId) {
            throw new Error(`Candidate ID not found for SBD: ${row.sbd}`);
          }

          for (const mapping of SUBJECT_MAPPING) {
            const rawScore = row[mapping.csvKey];
            if (rawScore && rawScore.trim() !== '') {
              const scoreVal = parseFloat(rawScore);
              if (!isNaN(scoreVal)) {
                scoresData.push({
                  candidateId,
                  subjectId: mapping.code,
                  score: scoreVal,
                });
              }
            }
          }
        }

        if (scoresData.length > 0) {
          await tx.score.createMany({
            data: scoresData,
          });
        }
      },
      {
        timeout: 30000,
      },
    );
  }

  console.log('Starting CSV stream...');
  const BATCH_SIZE = 5000;
  let batch: CsvRow[] = [];
  let totalProcessed = 0;
  const startTime = Date.now();

  const stream = fs.createReadStream(csvFilePath).pipe(csv());

  for await (const row of stream) {
    batch.push(row as CsvRow);

    if (batch.length === BATCH_SIZE) {
      stream.pause();
      try {
        await processBatch(batch);
        totalProcessed += batch.length;
        if (totalProcessed % 50000 === 0) {
          console.log(
            `Processed ${totalProcessed.toLocaleString()} candidates`,
          );
        }
      } catch (err) {
        console.error('Error importing batch:', err);
        process.exit(1);
      }
      batch = [];
      stream.resume();
    }
  }

  if (batch.length > 0) {
    try {
      await processBatch(batch);
      totalProcessed += batch.length;
    } catch (err) {
      console.error('Error importing final batch:', err);
      process.exit(1);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(
    `Seeding completed. Imported ${totalProcessed.toLocaleString()} candidates in ${duration} seconds.`,
  );
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
