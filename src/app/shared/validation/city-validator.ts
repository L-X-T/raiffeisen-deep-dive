import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const validateCity =
  (validCities: string[]): ValidatorFn =>
  (c: AbstractControl): ValidationErrors | null => {
    if (c.value && validCities.indexOf(c.value) === -1) {
      return {
        city: {
          actualValue: c.value,
          validCities
        }
      };
    }

    return null;
  };
