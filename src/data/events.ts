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
    registrationDeadline: '31/12/2099 23:59',
    description: 'Họp báo 17h00 - 21h00 Ngày 27/09/2025. Xác nhận tham dự để BTC sắp xếp đón tiếp.',
    bgImage: '/images/background/bg3.png',
    sheetName: 'HopBao',
    maxCapacity: 999999,
    currentCount: 0
  },
  {
    id: 'so-tuyen',
    name: 'Sơ Tuyển',
    slug: 'so-tuyen',
    status: 'open',
    date: '27/09/2025',
    endDate: '25/11/2025',
    registrationDeadline: '31/12/2099 23:59',
    description: 'Vòng Sơ Tuyển diễn ra từ 27/09/2025 đến 25/11/2025 (Sau họp báo, trước sơ khảo). Chọn khu vực & xác nhận tham gia.',
    bgImage: '/images/background/bg4.png',
    sheetName: 'SoTuyen',
    hasRegion: true,
    maxCapacity: 999999,
    currentCount: 0
  },
  {
    id: 'so-khao',
    name: 'Sơ khảo',
    slug: 'so-khao',
    status: 'open',
    date: '06/11/2025',
    endDate: '30/11/2025',
    registrationDeadline: '31/12/2099 23:59',
    description: 'Sơ khảo 06/11/2025 - 30/11/2025. Chọn khu vực sơ khảo & xác nhận tham dự.',
    bgImage: '/images/background/bg4.png',
    sheetName: 'SoKhao',
    hasRegion: true,
    maxCapacity: 999999,
    currentCount: 0
  },
  {
    id: 'ban-ket',
    name: 'Bán kết',
    slug: 'ban-ket',
    status: 'open',
    date: '05/12/2025',
    endDate: '15/12/2025',
    registrationDeadline: '31/12/2099 23:59',
    description: 'Bán kết 05/12/2025 - 15/12/2025. Chỉ dành cho thí sinh đủ điều kiện.',
    bgImage: '/images/background/bg2.png',
    sheetName: 'BanKet',
    hasContestantId: true,
    maxCapacity: 999999,
    currentCount: 0
  },
  {
    id: 'chung-ket',
    name: 'Chung kết',
    slug: 'chung-ket',
    status: 'open',
    date: '16/12/2025',
    endDate: '28/12/2025',
    registrationDeadline: '31/12/2099 23:59',
    description: 'Chung kết 16/12/2025 - 28/12/2025. Đăng ký mở không giới hạn thời gian và số lượng.',
    bgImage: '/images/background/bg2.png',
    sheetName: 'ChungKet',
    maxCapacity: 999999,
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


