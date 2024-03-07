import { TokenType } from 'src/core/sml/enums/token-type.type';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { SmlPostsFilterDto } from 'src/core/sml/dto';
import { Type } from 'class-transformer';

export class SMLMostUsedWordsWithProductsParamsDto extends SmlPostsFilterDto {
  @IsEnum(TokenType)
  @IsOptional()
  tokenType?: TokenType;

  @IsNotEmpty()
  @IsArray()
  @Type(() => Number)
  productIds: number[];
}
