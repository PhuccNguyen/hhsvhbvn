import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CheckinEventPage from '@/components/checkin/CheckinEventPage'
import { getEventBySlug } from '@/data/events'

export const metadata: Metadata = {
  title: 'Check-in Bán kết HHSV 2025 | Dành cho thí sinh đủ điều kiện',
  description: 'Chỉ dành cho thí sinh đủ điều kiện. BTC sẽ xác thực thông tin trước khi xếp chỗ.',
  openGraph: {
    title: 'Check-in Bán kết HHSV 2025',
    description: 'Xác nhận tham dự Vòng bán kết - 15/12/2025',
  }
}

export default function BanKetCheckinPage() {
  const event = getEventBySlug('ban-ket')
  
  if (!event) {
    notFound()
  }

  return <CheckinEventPage event={event} />
}
