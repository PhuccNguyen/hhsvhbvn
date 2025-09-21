import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CheckinEventPage from '@/components/checkin/CheckinEventPage'
import { getEventBySlug } from '@/data/events'

export const metadata: Metadata = {
  title: 'Check-in Họp báo HHSV 2025 | Xác nhận tham dự',
  description: 'Vui lòng điền thông tin để BTC xác nhận tham dự sự kiện Họp báo.',
  openGraph: {
    title: 'Check-in Họp báo HHSV 2025',
    description: 'Xác nhận tham dự sự kiện Họp báo - 27/09/2025',
  }
}

export default function HopBaoCheckinPage() {
  const event = getEventBySlug('hop-bao')
  
  if (!event) {
    notFound()
  }

  return <CheckinEventPage event={event} />
}
