import { Controller, Get, Param } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { SearchCandidateDto } from './dto/search-candidate.dto';

@Controller('api/candidates')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get(':registrationNo')
  findOne(@Param() params: SearchCandidateDto) {
    return this.candidateService.findByRegistrationNo(params.registrationNo);
  }
}
