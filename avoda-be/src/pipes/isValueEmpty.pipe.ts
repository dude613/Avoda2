import {
  PipeTransform,
  Injectable,
  HttpStatus,
  ArgumentMetadata,
} from '@nestjs/common';
import { AppError } from '@/shared/appError.util';

@Injectable()
export class EmptyValueValidationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if ((value && !value.length) || value.trim() === '') {
      throw new AppError(
        `Field ${metadata.data} cannot be empty`,
        HttpStatus.BAD_REQUEST
      );
    }
    return value;
  }
}
