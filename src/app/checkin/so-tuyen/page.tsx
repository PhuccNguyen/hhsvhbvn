import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CheckinEventPage from '@/components/checkin/CheckinEventPage'
import { getEventBySlug } from '@/data/events'

export const metadata: Metadata = {
  title: 'Check-in Sơ Tuyển HHSV 2025 | Xác nhận tham gia',
  description: 'Xác nhận tham gia vòng Sơ Tuyển Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025 - 27/09/2025 đến 25/11/2025.',
  openGraph: {
    title: 'Check-in Sơ Tuyển HHSV 2025',
    description: 'Xác nhận tham gia Vòng Sơ Tuyển - 27/09/2025 đến 25/11/2025',
  }
}

export default function SoTuyenCheckinPage() {
  const event = getEventBySlug('so-tuyen')
  
  if (!event) {
    notFound()
  }

  return <CheckinEventPage event={event} />
}