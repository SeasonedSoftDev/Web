import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiFile(fieldName = 'file', required = true) {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: required ? [fieldName] : [],
        properties: {
          name: { type: 'string', description: 'File name' },
          [fieldName]: {
            type: 'string',
            format: 'binary',
            description: 'A file in a binary format',
          },
        },
      },
    }),
  );
}
