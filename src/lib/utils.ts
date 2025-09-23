import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base32/Crockford alphabet excluding confusing characters (I, L, O)
const CROCKFORD_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function generateConfirmationCode(round: string): string {
  const prefixes = {
    'hop-bao': 'HB',
    'so-khao': 'SK',
    'ban-ket': 'BK',
    'chung-ket': 'CK'
  }
  
  const prefix = prefixes[round as keyof typeof prefixes] || 'XX';
  
  // Generate 6 random characters from Crockford alphabet
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * CROCKFORD_ALPHABET.length);
    code += CROCKFORD_ALPHABET[randomIndex];
  }
  
  return `${prefix}-${code}`;
}

export function hashConfirmationCode(code: string): string {
  // Simple hash for security (in production, use crypto.subtle or bcrypt)
  let hash = 0
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).toUpperCase()
}

export function formatPhoneNumber(phone: string): string {
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
  return emailRegex.test(email.trim())
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Local storage utilities
export const LocalStorageKeys = {
  CHECKIN_STATUS: 'hhsv_checkin_status',
  USER_DATA: 'hhsv_user_data'
} as const

export function saveCheckinStatus(round: string, email: string, confirmationCode: string) {
  if (typeof window === 'undefined') return
  
  const status = {
    round,
    email,
    confirmationCode,
    timestamp: new Date().toISOString()
  }
  
  localStorage.setItem(`${LocalStorageKeys.CHECKIN_STATUS}_${round}`, JSON.stringify(status))
}

export function getCheckinStatus(round: string): { email: string; confirmationCode: string; timestamp: string } | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(`${LocalStorageKeys.CHECKIN_STATUS}_${round}`)
  return stored ? JSON.parse(stored) : null
}

export function saveUserData(data: { fullName: string; email: string; phone: string }) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LocalStorageKeys.USER_DATA, JSON.stringify(data))
}

export function getUserData(): { fullName: string; email: string; phone: string } | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem(LocalStorageKeys.USER_DATA)
  return stored ? JSON.parse(stored) : null
}

// Retry utility for API calls
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
    }
  }
  
  throw lastError
}

// Checkin logging types and utilities
export interface CheckinAttemptLog {
  email: string
  round: string
  success: boolean
  error?: string
  duplicateFields?: string[]
  processingTime?: number
  clientIP?: string
  action?: string
  details?: Record<string, unknown>
}

function maskEmail(email: string): string {
  if (!email || email === 'unknown') return email;
  const [username, domain] = email.split('@');
  if (!domain) return email.substring(0, 3) + '***';
  return username.substring(0, 3) + '***@' + domain;
}

export function logCheckinAttempt(data: CheckinAttemptLog): void {
  const timestamp = new Date().toISOString();
  const maskedEmail = maskEmail(data.email);
  
  const logData = {
    timestamp,
    status: data.success ? 'SUCCESS' : 'FAILED',
    email: maskedEmail,
    round: data.round,
    action: data.action || 'checkin',
    ...(data.error && { error: data.error }),
    ...(data.duplicateFields && { duplicateFields: data.duplicateFields }),
    ...(data.processingTime && { processingTime: `${data.processingTime}ms` }),
    ...(data.clientIP && { clientIP: data.clientIP }),
    ...(data.details && { details: data.details })
  };

  // Console logging with color coding
  const logPrefix = data.success 
    ? '\x1b[32m[CHECKIN]\x1b[0m' // Green for success
    : '\x1b[31m[CHECKIN]\x1b[0m'; // Red for failure
    
  if (process.env.NODE_ENV === 'development') {
    console.log(`${logPrefix} ${timestamp}:`, logData);
  } else {
    // In production, log in a format suitable for log aggregation
    console.log(JSON.stringify({
      service: 'checkin',
      ...logData
    }));
  }
}

// Rate limiter utility
type RateLimiterResult = {
  allowed: boolean;
  retryAfter?: number;
};

type TokenBucket = {
  tokens: number;
  lastRefill: number;
};

const rateLimiters = new Map<string, TokenBucket>();

export function createRateLimiter(limit: number, windowMs: number) {
  return function checkRateLimit(key: string): RateLimiterResult {
    const now = Date.now();
    const bucket = rateLimiters.get(key) || { tokens: limit, lastRefill: now };
    
    // Calculate tokens to add based on time elapsed
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(timePassed / windowMs) * limit;
    
    // Refill tokens and update last refill time
    bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
    if (tokensToAdd > 0) {
      bucket.lastRefill = now;
    }
    
    // Check if request can be allowed
    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      rateLimiters.set(key, bucket);
      return { allowed: true };
    }
    
    // Calculate retry after time
    const retryAfter = Math.ceil((windowMs - (now - bucket.lastRefill)) / 1000);
    return { allowed: false, retryAfter };
  };
}

// Name validation utility with Vietnamese character support
export function validateFullName(name: string): boolean {
  // Support Vietnamese characters and standard Latin characters
  const vietnameseNameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
  const normalizedName = name.trim();
  
  // Basic validations
  if (normalizedName.length < 2) return false;
  if (normalizedName.length > 100) return false;
  
  // Must contain at least 2 words (first and last name)
  const words = normalizedName.split(/\s+/);
  if (words.length < 2) return false;
  
  // Each word should be at least 1 character
  if (words.some(word => word.length < 1)) return false;
  
  // Check for valid characters
  return vietnameseNameRegex.test(normalizedName);
}

// Event status check utility
import type { EventInfo, EventStatus } from './types';

export function getEventStatus(event: EventInfo): EventStatus {
  const now = new Date();
  const eventDate = new Date(event.date);
  const endDate = event.endDate ? new Date(event.endDate) : null;
  const registrationDeadline = event.registrationDeadline ? new Date(event.registrationDeadline) : null;

  // Check if event has reached capacity
  const capacityReached = event.maxCapacity !== undefined && 
                         event.currentCount !== undefined && 
                         event.currentCount >= event.maxCapacity;

  // Check registration deadline
  if (registrationDeadline && now > registrationDeadline) {
    return {
      status: 'closed',
      canRegister: false,
      message: 'Đã hết thời hạn đăng ký cho sự kiện này.'
    };
  }

  // Check capacity
  if (capacityReached) {
    return {
      status: 'closed',
      canRegister: false,
      message: 'Sự kiện đã đạt số lượng đăng ký tối đa.'
    };
  }

  // Event is in the past
  if (endDate && now > endDate) {
    return {
      status: 'closed',
      canRegister: false,
      message: 'Sự kiện đã kết thúc.'
    };
  }

  // Event is upcoming
  if (now < eventDate) {
    const daysLeft = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: 'upcoming',
      canRegister: event.status === 'open',
      daysLeft,
      message: event.status === 'open' 
        ? `Còn ${daysLeft} ngày nữa đến sự kiện` 
        : 'Sự kiện chưa mở đăng ký'
    };
  }

  // Event is ending soon (within 24 hours of end date)
  if (endDate && (endDate.getTime() - now.getTime()) <= 24 * 60 * 60 * 1000) {
    const hoursLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    return {
      status: 'ending-soon',
      canRegister: event.status === 'open' && !capacityReached,
      hoursLeft,
      message: `Chỉ còn ${hoursLeft} giờ để đăng ký!`
    };
  }

  // Event is open and within valid registration period
  return {
    status: event.status,
    canRegister: event.status === 'open' && !capacityReached,
    message: event.status === 'open' 
      ? 'Đang mở đăng ký'
      : 'Sự kiện chưa mở đăng ký'
  };
}