import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBetween1And5(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
      registerDecorator({
         name: 'isBetween1And5',
         target: object.constructor,
         propertyName: propertyName,
         options: validationOptions,
         validator: {
            validate(value: any, args: ValidationArguments) {
               return value >= 1 && value <= 5;
            }
         }
      });
   };
}