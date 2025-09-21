import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateConfirmationCode(round: string): string {
  const prefixes = {
    'hop-bao': 'HB',
    'so-khao': 'SK',
    'ban-ket': 'BK',
    'chung-ket': 'CK'
  }
  
  const prefix = prefixes[round as keyof typeof prefixes] || 'XX'
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${random}`
}

export function formatPhoneNumber(phone: string): string {
  // Chuẩn hóa số điện thoại Việt Nam
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('84')) {
    return '+' + cleaned
  }
  if (cleaned.startsWith('0')) {
    return '+84' + cleaned.substring(1)
  }
  return '+84' + cleaned
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}
