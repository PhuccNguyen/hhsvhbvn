import { EventInfo } from '@/lib/types'

export const events: EventInfo[] = [
  {
    id: 'hop-bao',
    name: 'Họp báo',
    slug: 'hop-bao',
    status: 'open', // Thay đổi theo thời gian thực
    date: '27/09/2025',
    description: 'Xác nhận tham dự để BTC sắp xếp đón tiếp.',
    bgImage: '/images/background/bg3.png',
    sheetName: 'HopBao'
  },
  {
    id: 'so-khao',
    name: 'Sơ khảo',
    slug: 'so-khao',
    status: 'upcoming',
    date: '05/10-25/11',
    description: 'Chọn khu vực sơ khảo & xác nhận tham dự.',
    bgImage: '/images/background/bg4.png',
    sheetName: 'SoKhao',
    hasRegion: true
  },
  {
    id: 'ban-ket',
    name: 'Bán kết',
    slug: 'ban-ket',
    status: 'upcoming',
    date: '15/12/2025',
    description: 'Chỉ dành cho thí sinh đủ điều kiện.',
    bgImage: '/images/background/bg2.png',
    sheetName: 'BanKet',
    hasContestantId: true
  },
  {
    id: 'chung-ket',
    name: 'Chung kết',
    slug: 'chung-ket',
    status: 'upcoming',
    date: '28/12/2025',
    description: 'Số lượng có hạn — vui lòng xác nhận sớm.',
    bgImage: '/images/background/bg2.png',
    sheetName: 'ChungKet'
  }
]

export function getEventBySlug(slug: string): EventInfo | undefined {
  return events.find(event => event.slug === slug)
}

export function getEventStatus(eventId: string): 'open' | 'upcoming' | 'closed' {
  // Trong thực tế, bạn có thể lấy từ database hoặc config
  // Hiện tại return status từ events array
  const event = events.find(e => e.id === eventId)
  return event?.status || 'closed'
}
