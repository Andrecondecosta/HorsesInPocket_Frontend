import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Junta classes condicionais e resolve conflitos do Tailwind (ex.: "px-2" + "px-4" → "px-4")
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
