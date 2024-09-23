import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private shema: z.ZodSchema<any>) {}

  transform(value: any) {
    const result = this.shema.safeParse(value);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }

    return result.data;
  }
}
