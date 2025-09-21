import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CheckinEventPage from '@/components/checkin/CheckinEventPage'
import { getEventBySlug } from '@/data/events'

export const metadata: Metadata = {
  title: 'Check-in Sơ khảo HHSV 2025 | Chọn khu vực và xác nhận',
  description: 'Chọn khu vực sơ khảo (Hà Nội, Đà Nẵng, TP.HCM) & xác nhận tham dự.',
  openGraph: {
    title: 'Check-in Sơ khảo HHSV 2025',
    description: 'Xác nhận tham dự Vòng sơ khảo - 05/10-25/11/2025',
  }
}

export default function SoKhaoCheckinPage() {
  const event = getEventBySlug('so-khao')
  
  if (!event) {
    notFound()
  }

  return <CheckinEventPage event={event} />
}
