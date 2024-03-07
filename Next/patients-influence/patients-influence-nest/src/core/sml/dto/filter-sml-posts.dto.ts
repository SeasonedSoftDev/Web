import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { decorate } from 'ts-mixer';

class AuthorFilterParamsDto {
  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  // @IsPositive({ each: true })
  @decorate(IsArray())
  @decorate(Type(() => Number))
  stakeholders?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  genders?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  diseaseAreas?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  locations?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  ethnicities?: number[];

  @decorate(IsOptional())
  // @IsDate()
  // ageMin?: Date;
  @decorate(IsNumber())
  @decorate(Min(0))
  ageMin?: number;

  @decorate(IsOptional())
  // @IsDate()
  // ageMax?: Date;
  @decorate(IsNumber())
  @decorate(Min(0))
  ageMax?: number;

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  struggles?: number[]; //! What is this !?

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  symptoms?: number[]; //! What is this !?

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  interests?: number[];

  @decorate(IsOptional())
  @decorate(IsString())
  bio?: string; //! What is this !?
}

class PostFilterParamsDto {
  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  socialMedias?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  themes?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  diseaseAreas?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  struggles?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  symptoms?: number[]; //! What is this !?

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  interests?: number[]; //! What is this !?

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  sentiments?: number[]; //overallSentiment

  @decorate(IsOptional())
  @decorate(IsString({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => String))
  languages?: string[]; // ? or INT

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  brands?: number[];

  @decorate(IsOptional())
  @decorate(IsInt({ each: true }))
  @decorate(IsPositive({ each: true }))
  @decorate(IsArray())
  @decorate(Type(() => Number))
  products?: number[];

  @decorate(IsOptional())
  @decorate(IsInt())
  @decorate(IsPositive())
  likesMin?: number;

  @decorate(IsOptional())
  @decorate(IsInt())
  @decorate(IsPositive())
  likesMax?: number;

  @decorate(IsOptional())
  @decorate(IsInt())
  @decorate(IsPositive())
  commentsMin?: number;

  @decorate(IsOptional())
  @decorate(IsInt())
  @decorate(IsPositive())
  commentsMax?: number;

  @decorate(IsOptional())
  @decorate(IsDate())
  dateFrom?: Date;

  @decorate(IsOptional())
  @decorate(IsDate())
  dateTo?: Date;

  @decorate(IsOptional())
  @decorate(IsString())
  keyword?: string; //! content?
}

class SmlPostsFilterDto {
  @decorate(IsOptional())
  @decorate(IsObject())
  @decorate(ValidateNested())
  @decorate(Type(() => AuthorFilterParamsDto))
  authorFilter?: AuthorFilterParamsDto;

  @decorate(IsOptional())
  @decorate(IsObject())
  @decorate(ValidateNested())
  @decorate(Type(() => PostFilterParamsDto))
  postFilter?: PostFilterParamsDto;
}

export { AuthorFilterParamsDto, PostFilterParamsDto, SmlPostsFilterDto };
