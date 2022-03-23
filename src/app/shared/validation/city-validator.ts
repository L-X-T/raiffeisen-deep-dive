import { AbstractControl, ValidationErrors } from '@angular/forms';

export const validateCity = (c: AbstractControl): ValidationErrors | null => {
  const validCities: string[] = ['Graz', 'Wien', 'Hamburg', 'Berlin'];
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
