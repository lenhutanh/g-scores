import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportRepository } from './repositories/report.repository';

@Module({
  controllers: [ReportController],
  providers: [
    ReportService,
    { provide: 'IReportRepository', useClass: ReportRepository },
  ],
  exports: [ReportService],
})
export class ReportModule {}
