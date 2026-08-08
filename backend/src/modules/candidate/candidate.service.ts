import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ICandidateRepository } from './interfaces/candidate.repository.interface';

@Injectable()
export class CandidateService {
  constructor(
    @Inject('ICandidateRepository')
    private readonly candidateRepository: ICandidateRepository,
  ) {}

  async findByRegistrationNo(registrationNo: string) {
    const candidate =
      await this.candidateRepository.findByRegistrationNo(registrationNo);

    if (!candidate) {
      throw new NotFoundException(
        `Candidate with registration number ${registrationNo} not found`,
      );
    }

    return {
      registrationNo: candidate.registrationNo,
      languageCode: candidate.languageCode,
      scores: candidate.scores.map((s) => ({
        subjectId: s.subjectId,
        subjectName: s.subject.name,
        score: Number(s.score),
      })),
    };
  }
}
