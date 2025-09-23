import { EventInfo } from '@/lib/types'
import { parseVietnameseDate, getEventStatus } from '@/lib/eventUtils'

export const events: EventInfo[] = [
  {
    id: 'hop-bao',
    name: 'Họp báo',
    slug: 'hop-bao',
    status: 'open',
    date: '27/09/2025',
    endDate: '27/09/2025',
    registrationDeadline: '26/09/2025 23:59',
    description: 'Xác nhận tham dự để BTC sắp xếp đón tiếp.',
    bgImage: '/images/background/bg3.png',
    sheetName: 'HopBao',
    maxCapacity: 200,
    currentCount: 0
  },
  {
    id: 'so-khao',
    name: 'Sơ khảo',
    slug: 'so-khao',
    status: 'upcoming',
    date: '05/10/2025',
    endDate: '25/11/2025',
    registrationDeadline: '20/11/2025 23:59',
    description: 'Chọn khu vực sơ khảo & xác nhận tham dự.',
    bgImage: '/images/background/bg4.png',
    sheetName: 'SoKhao',
    hasRegion: true,
    maxCapacity: 1000,
    currentCount: 0
  },
  {
    id: 'ban-ket',
    name: 'Bán kết',
    slug: 'ban-ket',
    status: 'upcoming',
    date: '15/12/2025',
    endDate: '15/12/2025',
    registrationDeadline: '10/12/2025 23:59',
    description: 'Chỉ dành cho thí sinh đủ điều kiện.',
    bgImage: '/images/background/bg2.png',
    sheetName: 'BanKet',
    hasContestantId: true,
    maxCapacity: 50,
    currentCount: 0
  },
  {
    id: 'chung-ket',
    name: 'Chung kết',
    slug: 'chung-ket',
    status: 'upcoming',
    date: '28/12/2025',
    endDate: '28/12/2025',
    registrationDeadline: '25/12/2025 23:59',
    description: 'Số lượng có hạn — vui lòng xác nhận sớm.',
    bgImage: '/images/background/bg2.png',
    sheetName: 'ChungKet',
    maxCapacity: 300,
    currentCount: 0
  }
]

export function getEventBySlug(slug: string): EventInfo | undefined {
  return events.find(event => event.slug === slug)
}

export function getEventById(id: string): EventInfo | undefined {
  return events.find(event => event.id === id)
}

// Real-time status checker with enhanced logic
export function getEventStatusRealtime(eventId: string, currentDate: Date = new Date()): ReturnType<typeof getEventStatus> {
  const event = events.find(e => e.id === eventId)
  if (!event) {
    return {
      status: 'closed',
      canRegister: false,
      message: 'Sự kiện không tồn tại'
    }
  }

  return getEventStatus(event, currentDate)
}

// Get events by status
export function getEventsByStatus(status?: EventInfo['status']): EventInfo[] {
  if (!status) return events
  return events.filter(event => {
    const realTimeStatus = getEventStatusRealtime(event.id)
    return realTimeStatus.status === status
  })
}

// Get upcoming events (next 30 days)
export function getUpcomingEvents(days: number = 30): EventInfo[] {
  const now = new Date()
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  
  return events.filter(event => {
    const eventDate = parseVietnameseDate(event.date)
    return eventDate >= now && eventDate <= futureDate
  })
}

// Get events by capacity status
export function getEventsByCapacity(): {
  available: EventInfo[]
  almostFull: EventInfo[]
  full: EventInfo[]
} {
  const available: EventInfo[] = []
  const almostFull: EventInfo[] = []
  const full: EventInfo[] = []

  events.forEach(event => {
    if (!event.maxCapacity || !event.currentCount) {
      available.push(event)
      return
    }

    const occupancyRate = event.currentCount / event.maxCapacity
    
    if (occupancyRate >= 1) {
      full.push(event)
    } else if (occupancyRate >= 0.8) {
      almostFull.push(event)
    } else {
      available.push(event)
    }
  })

  return { available, almostFull, full }
}


