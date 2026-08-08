import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IReportRepository } from '../interfaces/report.repository.interface';
import { SubjectCode } from '../../../generated/prisma/enums';

@Injectable()
export class ReportRepository implements IReportRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getStats(): Promise<any> {
    const stats = await this.prisma.$queryRaw`
      SELECT
        s.id AS "subjectId",
        s.name AS "subjectName",
        CAST(COUNT(sc.score) FILTER (WHERE sc.score >= 8) AS INTEGER) AS "gte8",
        CAST(COUNT(sc.score) FILTER (WHERE sc.score >= 6 AND sc.score < 8) AS INTEGER) AS "g6to8",
        CAST(COUNT(sc.score) FILTER (WHERE sc.score >= 4 AND sc.score < 6) AS INTEGER) AS "g4to6",
        CAST(COUNT(sc.score) FILTER (WHERE sc.score < 4) AS INTEGER) AS "lt4"
      FROM "Subject" s
      LEFT JOIN "Score" sc ON s.id = sc."subjectId"
      GROUP BY s.id, s.name
    `;
    return stats;
  }

  async getTopGroupA(): Promise<any> {
    return this.prisma.$queryRaw`
      WITH top_10_ids AS (
        SELECT 
          sc."candidateId",
          MAX(CASE WHEN sc."subjectId" = ${SubjectCode.math} THEN sc.score END) AS "math",
          MAX(CASE WHEN sc."subjectId" = ${SubjectCode.physics} THEN sc.score END) AS "physics",
          MAX(CASE WHEN sc."subjectId" = ${SubjectCode.chemistry} THEN sc.score END) AS "chemistry",
          SUM(sc.score) AS "totalScore"
        FROM "Score" sc
        WHERE sc."subjectId" IN (${SubjectCode.math}, ${SubjectCode.physics}, ${SubjectCode.chemistry})
        GROUP BY sc."candidateId"
        HAVING COUNT(DISTINCT sc."subjectId") = 3
        ORDER BY "totalScore" DESC
        LIMIT 10
      )
      SELECT 
        c."registrationNo",
        CAST(t."math" AS DOUBLE PRECISION) AS "math",
        CAST(t."physics" AS DOUBLE PRECISION) AS "physics",
        CAST(t."chemistry" AS DOUBLE PRECISION) AS "chemistry",
        CAST(t."totalScore" AS DOUBLE PRECISION) AS "totalScore"
      FROM top_10_ids t
      JOIN "Candidate" c ON t."candidateId" = c.id
      ORDER BY t."totalScore" DESC;
    `;
  }
}
