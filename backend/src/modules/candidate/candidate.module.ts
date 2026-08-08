import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { CandidateRepository } from './repositories/candidate.repository';

@Module({
  controllers: [CandidateController],
  providers: [
    CandidateService,
    {
      provide: 'ICandidateRepository',
      useClass: CandidateRepository,
    },
  ],
  exports: [CandidateService],
})
export class CandidateModule { }
