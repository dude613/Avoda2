import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export function IsTrimmed(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'IsTrimmed',
      validator: {
        validate: (value): boolean =>
          typeof value === 'string' && value.trim().length === value.length,
        defaultMessage: buildMessage(
          () => `$property must have non-whitespace characters`,
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
