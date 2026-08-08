import { Candidate, Score, Subject } from '../../../generated/prisma/client';

export type CandidateWithScores = Candidate & {
  scores: (Score & {
    subject: Subject;
  })[];
};

export interface ICandidateRepository {
  findByRegistrationNo(
    registrationNo: string,
  ): Promise<CandidateWithScores | null>;
}
