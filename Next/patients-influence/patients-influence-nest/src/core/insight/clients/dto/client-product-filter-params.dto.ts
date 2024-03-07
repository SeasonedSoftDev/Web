import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Status } from 'src/core/campaign/enums/status.enum';
import { PlatformProduct } from 'src/core/platform-product/enums/platform-product.enum';

export class ClientProductFilterParamsDto {
  @IsEnum(Status)
  @IsOptional()
  @ApiPropertyOptional({
    description: `Product status. Note that some products share some or all other of the product's statuses, and others do not.`,
    enum: Status,
  })
  status?: Status;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.statusAtPointOfTime === 'true' ? true : false))
  @ApiPropertyOptional({
    description: `In each period/interval select a product/s that had status at point of time. If this property is \`false\`, product/s will be selected based on status, but by current status, then will be separated through periods/intervals.`,
    type: Boolean,
    default: false,
  })
  statusAtPointOfTime?: boolean = false;

  @IsEnum(PlatformProduct)
  @IsOptional()
  @ApiPropertyOptional({
    description: `Select a product. If no product is selected, than all will be selected.`,
    enum: PlatformProduct,
  })
  product?: PlatformProduct;

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.withNoReport === 'true' ? true : false))
  @ApiPropertyOptional({
    description: `Select only the ones with no report.`,
    type: Boolean,
    default: false,
  })
  withNoReport?: boolean = false;

  /* @IsOptional()
  @IsBoolean()
  @Transform(({ obj }) => (obj.withNoProduct === 'true' ? true : false))
  @ApiPropertyOptional({
    description: `If \`true\`, only the ones with no product/s are selected. Works together with \`product\` filter.`,
    type: Boolean,
    default: false,
  })
  withNoProduct?: boolean = false; */
}

export class ClientCampaignFilterParamsDto extends OmitType(
  ClientProductFilterParamsDto,
  ['product'],
) {}

export class ClientSurveyFilterParamsDto extends OmitType(
  ClientProductFilterParamsDto,
  ['product', 'withNoReport'], // * survey does not have report product related to it
) {}

export class ClientSMLFilterParamsDto extends OmitType(
  ClientProductFilterParamsDto,
  ['product', 'withNoReport'], // * sml does not have report product related to it
) {}

export class ClientCampaignReportFilterParamsDto extends OmitType(
  ClientProductFilterParamsDto,
  ['product', 'withNoReport'], // * report can't have a report itself
) {}
