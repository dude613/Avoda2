import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

import { ValidationException } from '../filters/validation-exception.filter';

@Injectable()
export class ValidationPipe implements PipeTransform {
  /**
   * A pipe for validating incoming request data using class-validator and class-transformer.
   * It transforms the request data into an instance of the specified class and validates it.
   * If the validation fails, it throws a ValidationException.
   *
   * @example
   * ```typescript
   * import { ValidationPipe } from './validation.pipe';
   *
   * @UsePipes(new ValidationPipe())
   * @Post()
   * create(@Body() createDto: CreateDto) {
   *   // ...
   * }
   * ```
   */
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    /**
     * The metatype of the request data.
     * If the metatype is not provided or is a basic type (String, Boolean, Number, Array, Object),
     * the function returns the original value without validation.
     */
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    /**
     * Creates an instance of the metatype using class-transformer's plainToInstance function.
     * This allows class-validator to validate the instance.
     */
    const object = plainToInstance(metatype, value);

    try {
      /**
       * Validates the object using class-validator's validateOrReject function.
       * If the validation fails, it throws a ValidationException.
       */
      await validateOrReject(object);
    } catch (error) {
      throw new ValidationException(error);
    }

<<<<<<< HEAD
=======
    /**
     * Returns the original value if the validation passes.
     */
>>>>>>> main
    return value;
  }

  private toValidate(metaType: Type<any>): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metaType === type);
  }
}
