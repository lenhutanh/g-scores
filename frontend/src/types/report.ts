export type SubjectStats = {
  subjectId: string;
  subjectName: string;
  gte8: number;
  g6to8: number;
  g4to6: number;
  lt4: number;
}

export type TopCandidate = {
  registrationNo: string;
  math: number;
  physics: number;
  chemistry: number;
  totalScore: number;
}

