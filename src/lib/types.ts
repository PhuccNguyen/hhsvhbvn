export interface CheckinSubmission {
  fullName: string
  phone: string
  email: string
  confirmed: boolean
  round: 'hop-bao' | 'so-khao' | 'ban-ket' | 'chung-ket'
  region?: 'HN' | 'DN' | 'HCM'
  contestantId?: string
  timestamp: string
  confirmationCode: string // Required field for tracking
}

export interface CheckinResponse {
  success: boolean
  message: string
  confirmationCode?: string
  error?: string
  duplicateFields?: DuplicateDetails // New
  retryAfter?: number // New for rate limiting
}

export interface DuplicateDetails {
  email?: boolean
  phone?: boolean
  contestantId?: boolean
  message?: string
}

export interface EventStatus {
  status: 'open' | 'upcoming' | 'closed' | 'ending-soon'
  daysLeft?: number
  hoursLeft?: number
  canRegister: boolean
  message?: string
}

export interface EventInfo {
  id: string
  name: string
  slug: string
  status: 'open' | 'upcoming' | 'closed'
  date: string
  endDate?: string // New for registration deadline
  description: string
  bgImage: string
  sheetName: string
  hasRegion?: boolean
  hasContestantId?: boolean
  maxCapacity?: number // New
  currentCount?: number // New
  registrationDeadline?: string // New
}

export interface FormFieldError {
  field: string
  message: string
  type: 'validation' | 'duplicate' | 'server'
}

export interface CheckinFormState {
  isSubmitting: boolean
  errors: FormFieldError[]
  isSuccess: boolean
  eventStatus: EventStatus
  hasCheckedIn: boolean
  confirmationCode?: string
}
