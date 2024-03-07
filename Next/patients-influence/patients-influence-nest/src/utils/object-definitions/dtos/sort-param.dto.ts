import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { decorate } from 'ts-mixer';

export const sortByPropertiesDelimiter = ',';

export enum SortOrder {
  asc = 'asc',
  desc = 'desc',
}

export interface SortBy {
  [fieldName: string]: SortOrder;
}

export class SortParamDto<T> {
  @decorate(IsOptional())
  // @decorate(IsString())
  @decorate(
    ApiPropertyOptional({
      type: String,
      // default: '-id',
      description:
        `Sort by the following rules:<br>\t\t<ul>` +
        `<li>"+" or ommited prefix ascending order</li>` +
        `<li>"-" prefix descending order</li>` +
        `<li>use any of the properties from the response body to sort by</li>` +
        `<li>sorting by multiple properties is supported - use "," separator</li>` +
        `</ul>`,
      example: 'id,-updatedAt',
    }),
  )
  @decorate(
    Transform((obj) => {
      return SortParamDto.formatSortBy(obj.value);
    }),
  )
  // ! it is important to not give the default value, as missing the sortBy
  // ! query parameter will result in different sorting rules, which depends on
  // ! a model
  sortBy?: SortBy;

  // ! transform raw sortBy parameter into Prisma sortBy representation
  // TODO find a meaning of T, eg. limit fields to sort by
  // TODO adjust result so Prisma can sort by multiple properties (an array of objects as orderBy value)
  private static formatSortBy(sortBy: string): SortBy {
    const sortByRules = sortBy.split(sortByPropertiesDelimiter);
    const sortFormatted: SortBy = {};
    let propertyName: string;

    for (const rule of sortByRules) {
      if (rule[0] !== '-') {
        if (rule[0] === '+') {
          propertyName = rule.slice(1);
        } else {
          propertyName = rule;
        }
        sortFormatted[propertyName] = SortOrder.asc;
      } else {
        propertyName = rule.slice(1);
        sortFormatted[propertyName] = SortOrder.desc;
      }
    }

    return sortFormatted;
  }

  // TODO create a function that takes into account nested properties to sorty by
  private static formatPropertyPath(propertyName: string, propertyPath = {}) {
    const propertyPathParts = propertyName.split('.');

    if (propertyPathParts.length === 1)
      return Object.keys(propertyPath).length > 1 ? propertyPath : propertyName;

    return this.formatPropertyPath(
      propertyPathParts.slice(1).join('.'),
      undefined,
    );
  }
}
