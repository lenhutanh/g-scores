import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IReportRepository } from '../interfaces/report.repository.interface';

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
}
