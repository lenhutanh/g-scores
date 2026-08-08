import { Controller, Get } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('api/reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('stats')
  getStats() {
    return this.reportService.getStats();
  }
}
