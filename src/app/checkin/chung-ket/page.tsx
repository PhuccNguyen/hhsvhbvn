import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CheckinEventPage from '@/components/checkin/CheckinEventPage'
import { getEventBySlug } from '@/data/events'

export const metadata: Metadata = {
  title: 'Check-in Chung kết HHSV 2025 | Đêm Chung kết tại Cung Tiên Sơn',
  description: 'Số lượng có hạn — vui lòng xác nhận sớm. Đêm Chung kết tại Cung Tiên Sơn, Đà Nẵng.',
  openGraph: {
    title: 'Check-in Chung kết HHSV 2025',
    description: 'Xác nhận tham dự Đêm Chung kết - 28/12/2025',
  }
}

export default function ChungKetCheckinPage() {
  const event = getEventBySlug('chung-ket')
  
  if (!event) {
    notFound()
  }

  return <CheckinEventPage event={event} />
}
