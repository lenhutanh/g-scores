import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  ICandidateRepository,
  CandidateWithScores,
} from '../interfaces/candidate.repository.interface';

@Injectable()
export class CandidateRepository implements ICandidateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByRegistrationNo(
    registrationNo: string,
  ): Promise<CandidateWithScores | null> {
    return this.prisma.candidate.findUnique({
      where: { registrationNo },
      include: {
        scores: {
          include: {
            subject: true,
          },
        },
      },
    });
  }
}
