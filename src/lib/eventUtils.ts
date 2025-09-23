import { EventInfo, EventStatus } from './types'

// Parse Vietnamese date format
export function parseVietnameseDate(dateStr: string): Date {
  // Parse Vietnamese date format like "27/09/2025" or "05/10-25/11"
  const singleDate = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (singleDate) {
    const [, day, month, year] = singleDate
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  }
  
  // For date ranges, use the start date
  const rangeDate = dateStr.match(/^(\d{1,2})\/(\d{1,2})/)
  if (rangeDate) {
    const [, day, month] = rangeDate
    return new Date(2025, parseInt(month) - 1, parseInt(day))
  }
  
  return new Date()
}

// Get event status based on current date
export function getEventStatus(event: EventInfo, currentDate: Date = new Date()): EventStatus {
  const eventStartDate = parseVietnameseDate(event.date)
  const deadlineDate = event.registrationDeadline 
    ? parseVietnameseDate(event.registrationDeadline) 
    : eventStartDate

  // If current time is past the registration deadline
  if (currentDate > deadlineDate) {
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

  // Calculate days and hours left
  const timeLeft = deadlineDate.getTime() - currentDate.getTime()
  const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  // If less than 24 hours until deadline
  if (daysLeft === 0) {
    return {
      status: 'ending-soon',
      hoursLeft,
      canRegister: true,
      message: `Còn ${hoursLeft} giờ để đăng ký`
    }
  }

  // If within registration period
  if (currentDate <= deadlineDate) {
    return {
      status: 'open',
      daysLeft,
      canRegister: true,
      message: daysLeft > 0 ? `Còn ${daysLeft} ngày để đăng ký` : 'Đang mở đăng ký'
    }
  }

  // Default to upcoming if not open
  return {
    status: 'upcoming',
    canRegister: false,
    message: 'Sắp mở đăng ký'
  }
}