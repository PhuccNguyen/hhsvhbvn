export interface CheckinSubmission {
  fullName: string
  phone: string
  email: string
  confirmed: boolean
  round: 'hop-bao' | 'so-khao' | 'ban-ket' | 'chung-ket'
  region?: 'HN' | 'DN' | 'HCM' // Chỉ cho sơ khảo
  contestantId?: string // Chỉ cho bán kết
  timestamp: string
}

export interface CheckinResponse {
  success: boolean
  message: string
  confirmationCode?: string
  error?: string
}

export type EventStatus = 'open' | 'upcoming' | 'closed'

export interface EventInfo {
  id: string
  name: string
  slug: string
  status: EventStatus
  date: string
  description: string
  bgImage: string
  sheetName: string
  hasRegion?: boolean
  hasContestantId?: boolean
}
