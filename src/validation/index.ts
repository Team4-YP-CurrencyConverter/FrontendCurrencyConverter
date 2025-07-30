import { z } from 'zod';

export const schemaCurrencyValue = z
  .string()
  .regex(/^\d+\.?\d*$/g, {
    message: 'Некорректный ввод, допустимы только числа',
  })
  .max(10, { message: 'Максимальное колличество символов 10' });

export const schemaSearchCurrency = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Za-z]+$/, {
    message: 'Некорректный ввод, допустимы только латинские символы',
  })
  .max(3, { message: 'Максимальное колличество символов 3' });

function setError(message: string, errorElement: HTMLSpanElement) {
  errorElement.textContent = message;
  errorElement.classList.add('visible');
}

export function resetError(errorElement: HTMLSpanElement) {
  errorElement.textContent = '';
  errorElement.classList.remove('visible');
}

export function CheckIsValid(
  schema: z.ZodString,
  data: string,
  errorElement: HTMLSpanElement,
) {
  const validationResult = schema.safeParse(data);
  if (validationResult.success) {
    resetError(errorElement);
  } else {
    // eslint-disable-next-line no-underscore-dangle
    const message = validationResult.error.format()._errors[0];
    setError(message, errorElement);
  }
}
