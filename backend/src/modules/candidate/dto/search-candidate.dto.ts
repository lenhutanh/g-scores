import { IsString, Matches, Length } from 'class-validator';

export class SearchCandidateDto {
  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/)
  registrationNo: string;
}
