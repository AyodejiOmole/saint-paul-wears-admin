import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const COLOR_OPTIONS = [
  { value: 'red', label: 'Red', color: '#EF4444' },
  { value: 'blue', label: 'Blue', color: '#3B82F6' },
  { value: 'green', label: 'Green', color: '#10B981' },
  { value: 'yellow', label: 'Yellow', color: '#F59E0B' },
  { value: 'purple', label: 'Purple', color: '#8B5CF6' },
  { value: 'pink', label: 'Pink', color: '#EC4899' },
  { value: 'black', label: 'Black', color: '#1F2937' },
  { value: 'white', label: 'White', color: '#FFFFFF' },
  { value: 'gray', label: 'Gray', color: '#6B7280' },
  { value: 'brown', label: 'Brown', color: '#92400E' }
];

export const SIZE_OPTIONS = [
  { value: 'xs', label: 'Extra Small (XS)' },
  { value: 's', label: 'Small (S)' },
  { value: 'm', label: 'Medium (M)' },
  { value: 'l', label: 'Large (L)' },
  { value: 'xl', label: 'Extra Large (XL)' },
  { value: 'xxl', label: 'Double XL (XXL)' },
  { value: '28', label: '28"' },
  { value: '30', label: '30"' },
  { value: '32', label: '32"' },
  { value: '34', label: '34"' },
  { value: '36', label: '36"' },
  { value: '38', label: '38"' }
];