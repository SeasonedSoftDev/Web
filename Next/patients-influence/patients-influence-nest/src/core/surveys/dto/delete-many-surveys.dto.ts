import { IsInt, IsArray } from 'class-validator';

export class DeleteManySurveysDto {
  @IsArray()
  @IsInt({ each: true })
  surveyIds: number[];
}
