// validators.ts

/**
 * Validates if the input is a valid email address
 * @param email - The email string to validate
 */
export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if the input is a valid URL
 * @param url - The URL string to validate
 */
export const isUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if the input is a valid phone number
 * Accepts formats: +1234567890, 123-456-7890, (123) 456-7890
 * @param phoneNumber - The phone number string to validate
 */
export const isPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Validates if the input length is at least the minimum length
 * @param value - The string to validate
 * @param length - The minimum length required
 */
export const minLength = (value: string, length: number): boolean => {
  return value.length >= length;
};

/**
 * Validates if the input length is at most the maximum length
 * @param value - The string to validate
 * @param length - The maximum length allowed
 */
export const maxLength = (value: string, length: number): boolean => {
  return value.length <= length;
};

// Type definitions
export type ValidatorFunction = (value: string) => boolean;
export type LengthValidatorFunction = (value: string, length: number) => boolean;

// Validator interface for potential future use
export interface Validator {
  isEmail: ValidatorFunction;
  isUrl: ValidatorFunction;
  isPhoneNumber: ValidatorFunction;
  minLength: LengthValidatorFunction;
  maxLength: LengthValidatorFunction;
}