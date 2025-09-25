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

// Get event status based on current date
export function getEventStatus(event: EventInfo, currentDate: Date = new Date()): EventStatus {
  const eventStartDate = parseVietnameseDate(event.date)
  const registrationDeadline = event.registrationDeadline 
    ? parseVietnameseDate(event.registrationDeadline)
    : new Date(eventStartDate.getTime()) // Clone date

  // Set end of day for event start date if no specific time
  if (!event.date.includes(':')) {
    eventStartDate.setHours(23, 59, 59, 999)
  }

  // Registration hasn't started yet (if event is more than 30 days away)
  const thirtyDaysBeforeEvent = new Date(eventStartDate.getTime())
  thirtyDaysBeforeEvent.setDate(thirtyDaysBeforeEvent.getDate() - 30)
  if (currentDate < thirtyDaysBeforeEvent) {
    return {
      status: 'upcoming',
      canRegister: false,
      message: 'Chưa mở đăng ký'
    }
  }

  // Event has passed
  if (currentDate > eventStartDate) {
    return {
      status: 'closed',
      canRegister: false,
      message: 'Sự kiện đã kết thúc'
    }
  }

  // Registration deadline has passed
  if (currentDate > registrationDeadline) {
    return {
      status: 'closed',
      canRegister: false,
      message: 'Đã hết thời hạn đăng ký'
    }
  }

  // Check if event is at capacity
  if (event.maxCapacity && event.currentCount && event.currentCount >= event.maxCapacity) {
    return {
      status: 'closed',
      canRegister: false,
      message: 'Sự kiện đã đủ số lượng'
    }
  }

  // Calculate time remaining until registration deadline
  const timeLeft = registrationDeadline.getTime() - currentDate.getTime()
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  // Registration is open
  if (currentDate <= registrationDeadline) {
    // Less than 24 hours remaining
    if (daysLeft === 0) {
      return {
        status: 'ending-soon',
        hoursLeft,
        canRegister: true,
        message: `Còn ${hoursLeft} giờ để đăng ký`
      }
    }

    // Normal registration period
    return {
      status: 'open',
      daysLeft,
      canRegister: true,
      message: `Còn ${daysLeft} ngày để đăng ký`
    }
  }

  // Default case: registration hasn't started yet
  return {
    status: 'upcoming',
    canRegister: false,
    message: 'Chưa mở đăng ký'
  }
}