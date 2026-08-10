const DIGITS_RE = /^[6-9]\d{9}$/;
const E164_RE = /^\+91[6-9]\d{9}$/;

/** Normalize UI input to E.164 `+91…` or return null if invalid. */
export function toE164Phone(input: string): string | null {
  const trimmed = input.trim();
  if (E164_RE.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "").slice(-10);
  if (!DIGITS_RE.test(digits)) return null;
  return `+91${digits}`;
}

export function formatPhoneDisplay(e164OrDigits: string): string {
  const digits = e164OrDigits.replace(/\D/g, "").slice(-10);
  if (digits.length !== 10) return e164OrDigits;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function isValidIndianMobile(input: string): boolean {
  return toE164Phone(input) !== null;
}
