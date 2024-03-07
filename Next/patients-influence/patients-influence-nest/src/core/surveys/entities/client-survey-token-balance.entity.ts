import { ApiProperty } from '@nestjs/swagger';
import { ClientSurveyTokenBalance } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime';
import { Transform } from 'class-transformer';

export class ClientSurveyTokenBalanceEntity
  implements ClientSurveyTokenBalance
{
  id: number;
  surveyId: number;
  chatMessageId: number;
  @ApiProperty({ type: Number })
  @Transform((obj) => obj.value.toNumber(), { toPlainOnly: true })
  tokenBalance: Decimal;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ClientSurveyTokenBalanceEntity>) {
    Object.assign(this, partial);
  }
}
