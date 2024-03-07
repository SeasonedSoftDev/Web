import { AmbassadorRegistrationDto } from './ambassador-registration.dto';
import { OmitType, PartialType, IntersectionType } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { CreateUserDto } from 'src/core/users/dto/create-user.dto';

export class UpdateAmbassadorDto extends IntersectionType(
  PartialType(
    OmitType(CreateUserDto, [
      'id',
      'createdAt',
      'updatedAt',
      'role',
      'status',
      'isDeleted',
    ]),
  ),
  AmbassadorRegistrationDto,
) {
  @IsOptional()
  @IsInt()
  industryId: number;
}
