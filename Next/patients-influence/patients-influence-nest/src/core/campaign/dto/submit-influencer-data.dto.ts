import { IsNotEmpty, IsUrl } from 'class-validator';

export class SubmitInfluencerDataDto {
  @IsUrl()
  @IsNotEmpty()
  submissionLink: string;
}
