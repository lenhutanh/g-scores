import { Inject, Injectable } from '@nestjs/common';
import type { IReportRepository } from './interfaces/report.repository.interface';

@Injectable()
export class ReportService {
  constructor(
    @Inject('IReportRepository')
    private readonly reportRepository: IReportRepository,
  ) {}

  async getStats() {
    return this.reportRepository.getStats();
  }
}
