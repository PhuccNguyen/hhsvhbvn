import { Metadata } from 'next'
import CheckinHub from '@/components/checkin/CheckinHub'

export const metadata: Metadata = {
  title: 'Check-in HHSV 2025 | Xác nhận tham dự sự kiện',
  description: 'Chọn sự kiện để xác nhận tham dự. Hoàn tất trong ~30 giây.',
  openGraph: {
    title: 'Check-in HHSV 2025',
    description: 'Xác nhận tham dự sự kiện Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
  }
}

export default function CheckinPage() {
  return <CheckinHub />
}
