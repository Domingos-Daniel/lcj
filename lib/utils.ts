import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Update formatDate function to handle DD/MM/YYYY formatted strings
export function formatDate(date: string | Date | null) {
  if (!date) return '-'
  
  try {
    // First check if it's already in DD/MM/YYYY format (like '16/08/2024')
    if (typeof date === 'string' && date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      // It's already formatted, just return it
      return date;
    }
    
    // Otherwise try to parse as Date object
    const parsedDate = date instanceof Date ? date : new Date(date)
    
    // Verify it's a valid date
    if (isNaN(parsedDate.getTime())) {
      console.warn('Data inválida:', date)
      return '-'
    }
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(parsedDate)
  } catch (error) {
    console.error('Error formatting date:', error, 'for date:', date)
    return '-'
  }
}

// Função auxiliar para ajudar no debug de datas
export function debugDate(date: any): string {
  if (!date) return 'null/undefined'
  
  try {
    if (date instanceof Date) {
      return `Date object: ${date.toISOString()}`
    }
    
    const parsed = new Date(date)
    if (isNaN(parsed.getTime())) {
      return `Invalid date string: ${String(date)}`
    }
    
    return `Valid date: ${parsed.toISOString()} (original: ${String(date)})`
  } catch (e) {
    return `Error parsing: ${String(date)}, Error: ${e.message}`
  }
}

