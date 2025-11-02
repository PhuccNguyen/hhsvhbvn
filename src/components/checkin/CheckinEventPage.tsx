'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  Users,
  Crown,
  Trophy,
  CheckCircle,
  Info,
  Phone,
  Mail,
  Shield,
  Star,
  Heart
} from 'lucide-react'
import { EventInfo, CheckinResponse } from '@/lib/types'
import CheckinForm from './CheckinForm'
import StatusPill from './StatusPill'
import Timeline from './Timeline'
import styles from './CheckinEventPage.module.css'

interface CheckinEventPageProps {
  event: EventInfo
}

const CheckinEventPage = ({ event }: CheckinEventPageProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const getEventIcon = () => {
    switch (event.id) {
      case 'hop-bao': return Calendar
      case 'so-tuyen': return Users
      case 'so-khao': return Users
      case 'ban-ket': return Crown
      case 'chung-ket': return Trophy
      default: return Calendar
    }
  }

  const getEventColor = () => {
    switch (event.id) {
      case 'hop-bao': return '#8B5CF6'
      case 'so-tuyen': return '#10B981'
      case 'so-khao': return '#3B82F6'
      case 'ban-ket': return '#F59E0B'
      case 'chung-ket': return '#E7C873'
      default: return '#64748b'
    }
  }

  const getEventInfo = () => {
    switch (event.id) {
      case 'hop-bao':
        return {
          location: 'Nhà hát Trưng Vương, Đà Nẵng',
          time: '17:00 - 21:00 ICT',
          date: '27 Tháng 9, 2025',
          note: 'Vui lòng có mặt sớm 30 phút để làm thủ tục. Trang phục lịch sự.',
          documents: 'CCCD/CMND + Thẻ sinh viên',
          status: 'Đã hoàn thành'
        }
      case 'so-tuyen':
        return {
          location: 'HN • Đà Nẵng • TP.HCM • Cần Thơ',
          time: '08:00 - 17:00 ICT',
          date: '27/09 - 25/11/2025',
          note: 'Vòng sơ tuyển diễn ra sau họp báo, trước sơ khảo. Chọn khu vực phù hợp.',
          documents: 'Hồ sơ đăng ký + CCCD + Ảnh',
          status: 'Đang mở đăng ký'
        }
      case 'so-khao':
        return {
          location: 'HN • Đà Nẵng • TP.HCM • Cần Thơ',
          time: '08:00 - 17:00 ICT',
          date: '06/11 - 30/11/2025',
          note: 'Chọn khu vực phù hợp. Chuẩn bị hồ sơ đầy đủ theo quy định BTC.',
          documents: 'Hồ sơ đăng ký + CCCD + Ảnh',
          status: 'Đang mở đăng ký'
        }
      case 'ban-ket':
        return {
          location: 'Nhà hát Trưng Vương, Đà Nẵng',
          time: '19:00 - 22:00 ICT',
          date: '05/12 - 15/12/2025',
          note: 'Chỉ dành cho thí sinh vượt qua vòng sơ khảo. Dress code: Váy dạ hội.',
          documents: 'CCCD + Thẻ thí sinh + Vé mời',
          status: 'Sắp diễn ra'
        }
      case 'chung-ket':
        return {
          location: 'Cung Tiên Sơn, Đà Nẵng',
          time: '19:00 - 23:00 ICT',
          date: '16/12 - 28/12/2025',
          note: 'Đêm Chung kết hoành tráng. Số lượng ghế có hạn, đăng ký sớm.',
          documents: 'Vé mời + CCCD (bắt buộc)',
          status: 'Sắp diễn ra'
        }
    }
  }

  const eventInfo = getEventInfo()
  const Icon = getEventIcon()
  const eventColor = getEventColor()

  const handleFormSuccess = (response: CheckinResponse) => {
    if (response.success) {
      setIsSubmitted(true)
      // Smooth scroll to success message on mobile
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
    } else {
      setIsSubmitted(false) // Reset state when user wants to try again
    }
  }

  const getQuickStats = () => {
    switch (event.id) {
      case 'hop-bao':
        return [
          { icon: Users, label: 'Khách mời', value: '300+', color: 'purple' },
          { icon: Calendar, label: 'Thời lượng', value: '4h', color: 'blue' }
        ]
      case 'so-tuyen':
        return [
          { icon: Users, label: 'Thí sinh', value: '1000+', color: 'green' },
          { icon: MapPin, label: 'Khu vực', value: '4', color: 'blue' },
          { icon: Star, label: 'Vào SK', value: '500+', color: 'gold' }
        ]
      case 'so-khao':
        return [
          { icon: Users, label: 'Thí sinh', value: '500+', color: 'blue' },
          { icon: MapPin, label: 'Khu vực', value: '4', color: 'green' },
          { icon: Star, label: 'Vào BK', value: '50', color: 'gold' }
        ]
      case 'ban-ket':
        return [
          { icon: Crown, label: 'Thí sinh BK', value: '50', color: 'orange' },
          { icon: Trophy, label: 'Vào CK', value: '15', color: 'gold' }
        ]
      case 'chung-ket':
        return [
          { icon: Trophy, label: 'Top thí sinh', value: '15', color: 'gold' },
          { icon: Heart, label: 'Giải thưởng', value: '2 tỷ+', color: 'pink' }
        ]
      default:
        return []
    }
  }

  if (event.status === 'closed') {
    return (
      <div className={styles.eventContainer}>
        <div className={styles.backgroundContainer}>
          <div className={styles.overlay} />
        </div>

        <div className={styles.container}>
          <motion.div
            className={styles.closedCard}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.closedIcon}>
              <AlertCircle size={40} />
            </div>
            <h2 className={styles.closedTitle}>Đã kết thúc nhận đăng ký</h2>
            <p className={styles.closedMessage}>
              Sự kiện <strong>{event.name}</strong> đã đóng đăng ký.
              Vui lòng xem các sự kiện khác hoặc theo dõi fanpage để cập nhật thông tin mới nhất.
            </p>

            <div className={styles.closedActions}>
              <Link href="/checkin" className={styles.backToHub}>
                <ArrowLeft size={16} />
                Xem sự kiện khác
              </Link>

              <a
                href="https://www.facebook.com/hoahausinhvienhoabinhvn"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.followPage}
              >
                <Heart size={16} />
                Theo dõi fanpage
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.eventContainer}>
      {/* Light Professional Background */}
      <div className={styles.backgroundContainer}>
        <div className={styles.overlay} />
        <div className={styles.gradientOverlay} />
      </div>

      <div className={styles.container}>
        {/* Breadcrumb */}
        <motion.div
          className={styles.breadcrumb}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/checkin" className={styles.breadcrumbLink}>
            <ArrowLeft size={14} />
            <span>Trang tổng quan</span>
          </Link>
        </motion.div>

        {/* Hero Section - Compact & Professional */}
        <motion.section
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heroCard}>
            <div className={styles.heroHeader}>
              <div className={styles.heroIconWrapper}>
                <motion.div
                  className={styles.heroIcon}
                  style={{ color: eventColor }}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon size={24} />
                </motion.div>
                <StatusPill status={event.status} size="small" />
              </div>

              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  Check-in {event.name}
                </h1>
                <p className={styles.heroSubtitle}>
                  {event.slug === 'so-tuyen'
                    ? 'Chọn khu vực và xác nhận tham gia sơ tuyển (sau họp báo, trước sơ khảo)'
                    : event.slug === 'so-khao'
                      ? 'Chọn khu vực và xác nhận tham dự sơ khảo'
                      : event.slug === 'ban-ket'
                        ? 'Xác nhận tham dự bán kết - Thí sinh đã lọt vòng trong'
                        : event.slug === 'chung-ket'
                          ? 'Đăng ký tham dự đêm Chung kết hoành tráng'
                          : 'Xác nhận tham dự và nhận thông tin chi tiết sự kiện'
                  }
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={styles.quickStats}>
              {getQuickStats().map((stat, index) => {
                const StatIcon = stat.icon
                return (
                  <motion.div
                    key={index}
                    className={`${styles.statItem} ${styles[`stat${stat.color}`]}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                  >
                    <StatIcon size={14} />
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>

        

        {/* Event Details - Streamlined */}
        <motion.section
          className={styles.detailsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.detailsGrid}>
            <motion.div
              className={styles.detailCard}
              whileHover={{ y: -2, scale: 1.01 }}
            >
              <Calendar size={16} style={{ color: eventColor }} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Thời gian</span>
                <span className={styles.detailValue}>{eventInfo?.date}</span>
                <span className={styles.detailTime}>{eventInfo?.time}</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.detailCard}
              whileHover={{ y: -2, scale: 1.01 }}
            >
              <MapPin size={16} style={{ color: eventColor }} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Địa điểm</span>
                <span className={styles.detailValue}>{eventInfo?.location}</span>
                <span className={styles.detailTime}>{eventInfo?.status}</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.detailCard}
              whileHover={{ y: -2, scale: 1.01 }}
            >
              <Info size={16} style={{ color: eventColor }} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Cần mang theo</span>
                <span className={styles.detailValue}>{eventInfo?.documents}</span>
              </div>
            </motion.div>
          </div>

          {/* Important Note - Compact */}
          <motion.div
            className={styles.importantNote}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AlertCircle size={16} />
            <div className={styles.noteContent}>
              <span className={styles.noteTitle}>Lưu ý quan trọng</span>
              <p className={styles.noteText}>
                ⚠️ Sau khi đăng ký thành công, hãy <span style={{ color: "#E63946", fontWeight: "bold" }}>tải lại trang (F5)</span> để cập nhật dữ liệu mới nhất.
              </p>

              <p className={styles.noteText}>{eventInfo?.note}</p>
            </div>
          </motion.div>
        </motion.section>

        {/* Form Section - Priority */}
        <Suspense fallback={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.loadingState}
          >
            <div className={styles.loadingSpinner} />
            <p>Đang xử lý...</p>
          </motion.div>
        }>
          {!isSubmitted && (
            <motion.section
              className={styles.formSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className={styles.formHeader}>
                <h2 className={styles.formTitle}>Thông tin check-in</h2>
                <p className={styles.formSubtitle}>
                  Điền thông tin bên dưới để xác nhận tham dự
                </p>
              </div>

              <CheckinForm
                event={event}
                onSuccess={handleFormSuccess}
              />
            </motion.section>
          )}
        </Suspense>

        {/* Timeline - Compact */}
        <motion.section
          className={styles.timelineSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Lịch trình tổng quan</h3>
            <p className={styles.sectionSubtitle}>Các mốc thời gian quan trọng</p>
          </div>
          <Timeline compact showDescription={false} />
        </motion.section>

        {/* Support Section - Compact */}
        <motion.section
          className={styles.supportSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className={styles.supportCard}>
            <div className={styles.supportHeader}>
              <div className={styles.supportIcon}>
                <Shield size={18} />
              </div>
              <div className={styles.supportContent}>
                <h3 className={styles.supportTitle}>Cần hỗ trợ?</h3>
                <p className={styles.supportSubtitle}>Liên hệ BTC ngay</p>
              </div>
            </div>

            <div className={styles.supportActions}>
              <a href="tel:0902031034" className={styles.contactButton}>
                <Phone size={14} />
                <span>Gọi hotline</span>
              </a>
              <a href="mailto:tpaentertainment2025@gmail.com" className={styles.contactButton}>
                <Mail size={14} />
                <span>Gửi email</span>
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default CheckinEventPage
