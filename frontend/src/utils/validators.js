export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function isPositiveNumber(value) {
  const number = Number(value);
  return !Number.isNaN(number) && number > 0;
}
