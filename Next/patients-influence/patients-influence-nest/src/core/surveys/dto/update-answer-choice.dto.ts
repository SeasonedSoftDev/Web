import { PartialType } from '@nestjs/swagger';
import { CreateAnswerChoiceDto } from './create-answer-choice.dto';

export class UpdateAnswerChoiceDto extends PartialType(CreateAnswerChoiceDto) {}
