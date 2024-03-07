import { TokenType } from 'src/core/sml/enums/token-type.type';
import { IsEnum, IsOptional } from 'class-validator';
import { SmlPostsFilterDto } from 'src/core/sml/dto';

export class SMLMostMentionedWordsParamsDto extends SmlPostsFilterDto {
  @IsEnum(TokenType)
  @IsOptional()
  tokenType?: TokenType;
}
