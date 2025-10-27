import { EventInfo, EventStatus } from './types'

// Parse Vietnamese date format with time support
export function parseVietnameseDate(dateStr: string): Date {
  // Parse date with time like "27/09/2025 23:59"
  const dateTimeFormat = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{2}:\d{2})?$/
  const dateTimeMatch = dateStr.match(dateTimeFormat)
  if (dateTimeMatch) {
    const [, day, month, year, time] = dateTimeMatch
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    if (time) {
      const [hours, minutes] = time.split(':')
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    } else {
      // If no time specified, set to end of day for deadlines
      date.setHours(23, 59, 59, 999)
    }
    return date
  }
  
  // Parse date range like "05/10-25/11"
  const rangeDateFormat = /^(\d{1,2})\/(\d{1,2})-(\d{1,2})\/(\d{1,2})$/
  const rangeMatch = dateStr.match(rangeDateFormat)
  if (rangeMatch) {
    const [, startDay, startMonth] = rangeMatch
    const currentYear = new Date().getFullYear()
    return new Date(currentYear, parseInt(startMonth) - 1, parseInt(startDay))
  }
  
  // If no valid format, return current date
  console.warn('Invalid date format:', dateStr)
  return new Date()
}

// Get event status based on current date - Updated to always allow registration
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getEventStatus(_event: EventInfo, _currentDate?: Date): EventStatus {
  // Always return open status - registration is unlimited and never expires
  return {
    status: 'open',
    canRegister: true,
    message: 'Đăng ký mở không giới hạn thời gian'
  }
}