export type Score = {
  subjectId: string;
  subjectName: string;
  score: number;
}

export type CandidateScoreData = {
  registrationNo: string;
  languageCode: string | null;
  scores: Score[];
}
