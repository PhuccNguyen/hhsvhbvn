'use client'

import { useState } from 'react'
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
  Shield
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
      case 'so-khao': return Users
      case 'ban-ket': return Crown
      case 'chung-ket': return Trophy
      default: return Calendar
    }
  }

  const getEventGradient = () => {
    switch (event.id) {
      case 'hop-bao': return 'linear-gradient(135deg, #fee2e2, #fecaca, #fca5a5)'
      case 'so-khao': return 'linear-gradient(135deg, #fef3c7, #fde68a, #fcd34d)'
      case 'ban-ket': return 'linear-gradient(135deg, #dbeafe, #bfdbfe, #93c5fd)'
      case 'chung-ket': return 'linear-gradient(135deg, #e9d5ff, #d8b4fe, #c084fc)'
      default: return 'linear-gradient(135deg, #f1f5f9, #e2e8f0, #cbd5e1)'
    }
  }

  const getEventColor = () => {
    switch (event.id) {
      case 'hop-bao': return '#dc2626'
      case 'so-khao': return '#d97706'
      case 'ban-ket': return '#2563eb'
      case 'chung-ket': return '#7c3aed'
      default: return '#64748b'
    }
  }

  const getEventInfo = () => {
    switch (event.id) {
      case 'hop-bao':
        return {
          location: 'Khách sạn Mường Thanh, Đà Nẵng',
          time: '16:00 - 21:00 (27/09/2025)',
          note: 'Vui lòng có mặt sớm 30 phút để làm thủ tục đăng ký',
          dresscode: 'Trang phục lịch sự, trang trọng',
          documents: 'CCCD/CMND + Thẻ sinh viên'
        }
      case 'so-khao':
        return {
          location: 'Hà Nội • Đà Nẵng • TP.HCM',
          time: 'Theo lịch từng khu vực (10-11/2025)',
          note: 'Chọn khu vực phù hợp với nơi bạn đang sinh sống',
          dresscode: 'Áo dài hoặc trang phục dân tộc',
          documents: 'Hồ sơ đầy đủ theo quy định'
        }
      case 'ban-ket':
        return {
          location: 'Nhà hát Trưng Vương, Đà Nẵng',
          time: '19:00 - 22:00 (15/12/2025)',
          note: 'Chỉ dành cho thí sinh vượt qua vòng sơ khảo',
          dresscode: 'Váy dạ hội, trang phục biểu diễn',
          documents: 'CCCD + Thẻ thí sinh + Vé mời'
        }
      case 'chung-ket':
        return {
          location: 'Cung Tiên Sơn, Đà Nẵng',
          time: '19:00 - 23:00 (28/12/2025)',
          note: 'Đêm Chung kết - Số lượng có hạn, vui lòng đăng ký sớm',
          dresscode: 'Trang phục dạ tiệc sang trọng',
          documents: 'Vé mời + CCCD (bắt buộc)'
        }
    }
  }

  const eventInfo = getEventInfo()
  const Icon = getEventIcon()
  const eventColor = getEventColor()
  const eventGradient = getEventGradient()

  const handleFormSuccess = (response: CheckinResponse) => {
    setIsSubmitted(true)
    // Scroll to top on mobile
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getCountdownText = () => {
    if (event.status === 'closed') return null
    if (event.status === 'upcoming') return 'Sắp mở đăng ký'
    
    // Trong thực tế, bạn sẽ tính toán countdown thực
    const countdowns = {
      'hop-bao': 'Còn 12 ngày 5 giờ',
      'so-khao': 'Còn 25 ngày',
      'ban-ket': 'Còn 45 ngày', 
      'chung-ket': 'Còn 67 ngày'
    }
    return countdowns[event.id as keyof typeof countdowns]
  }

  if (event.status === 'closed') {
    return (
      <div className={styles.eventContainer}>
        <div className={styles.backgroundContainer}>
          <div 
            className={styles.bgImage}
            style={{ backgroundImage: `url(${event.bgImage})` }}
          />
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
              <AlertCircle size={48} />
            </div>
            <h2 className={styles.closedTitle}>Đã kết thúc nhận đăng ký</h2>
            <p className={styles.closedMessage}>
              Sự kiện <strong>{event.name}</strong> đã đóng đăng ký. 
              Vui lòng xem các sự kiện khác hoặc theo dõi fanpage để cập nhật thông tin mới nhất.
            </p>
            
            <div className={styles.closedActions}>
              <Link href="/checkin" className={styles.backToHub}>
                <ArrowLeft size={18} />
                Xem sự kiện khác
              </Link>
              
              <a 
                href="https://facebook.com/tpaentertainment" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.followPage}
              >
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
      {/* Enhanced Background */}
      <div className={styles.backgroundContainer}>
        <div 
          className={styles.bgImage}
          style={{ backgroundImage: `url(${event.bgImage})` }}
        />
        <div 
          className={styles.gradientOverlay}
          style={{ background: eventGradient }}
        />
        <div className={styles.overlay} />
      </div>

      <div className={styles.container}>
        {/* Enhanced Breadcrumb */}
        <motion.div
          className={styles.breadcrumb}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/checkin" className={styles.breadcrumbLink}>
            <ArrowLeft size={16} />
            <span>Trang tổng quan</span>
          </Link>
        </motion.div>

        {/* Enhanced Hero Section */}
        <motion.section 
          className={styles.hero}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heroCard}>
            <div className={styles.heroHeader}>
              <motion.div
                className={styles.heroIcon}
                style={{ color: eventColor }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Icon size={40} />
              </motion.div>
              
              <div className={styles.heroTitleArea}>
                <div className={styles.eventBadge} style={{ borderColor: eventColor, color: eventColor }}>
                  <Calendar size={12} />
                  <span>Sự kiện</span>
                </div>
                
                <h1 className={styles.heroTitle}>
                  Check-in {event.name}
                </h1>
              </div>
            </div>
            
            <p className={styles.heroDescription}>
              {event.slug === 'so-khao' 
                ? 'Chọn khu vực sơ khảo phù hợp và xác nhận tham dự để hoàn tất đăng ký.'
                : event.slug === 'ban-ket'
                ? 'Dành cho thí sinh đã vượt qua vòng sơ khảo. BTC sẽ xác thực thông tin trước khi xếp chỗ ngồi.'
                : event.slug === 'chung-ket'
                ? 'Đêm Chung kết tại Cung Tiên Sơn. Số lượng có hạn — vui lòng xác nhận tham dự sớm.'
                : 'Vui lòng điền đầy đủ thông tin bên dưới để Ban tổ chức xác nhận tham dự và sắp xếp đón tiếp.'
              }
            </p>

            <div className={styles.heroMeta}>
              <StatusPill status={event.status} size="large" />
              {event.status === 'open' && getCountdownText() && (
                <motion.div 
                  className={styles.countdown}
                  animate={{ 
                    boxShadow: ['0 0 0 rgba(16, 185, 129, 0)', '0 0 20px rgba(16, 185, 129, 0.2)', '0 0 0 rgba(16, 185, 129, 0)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock size={16} />
                  <span>{getCountdownText()}</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Enhanced Event Details */}
        <motion.section
          className={styles.detailsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.detailsGrid}>
            <motion.div 
              className={styles.detailCard}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.detailIcon} style={{ color: eventColor }}>
                <Calendar size={20} />
              </div>
              <div className={styles.detailContent}>
                <h4 className={styles.detailTitle}>Thời gian</h4>
                <p className={styles.detailText}>{eventInfo?.time}</p>
              </div>
            </motion.div>

            <motion.div 
              className={styles.detailCard}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.detailIcon} style={{ color: eventColor }}>
                <MapPin size={20} />
              </div>
              <div className={styles.detailContent}>
                <h4 className={styles.detailTitle}>Địa điểm</h4>
                <p className={styles.detailText}>{eventInfo?.location}</p>
              </div>
            </motion.div>

            <motion.div 
              className={styles.detailCard}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={styles.detailIcon} style={{ color: eventColor }}>
                <Info size={20} />
              </div>
              <div className={styles.detailContent}>
                <h4 className={styles.detailTitle}>Dress code</h4>
                <p className={styles.detailText}>{eventInfo?.dresscode}</p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className={styles.importantNote}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className={styles.noteIcon}>
              <AlertCircle size={20} />
            </div>
            <div className={styles.noteContent}>
              <h4 className={styles.noteTitle}>Lưu ý quan trọng</h4>
              <p className={styles.noteText}>{eventInfo?.note}</p>
              <p className={styles.noteText}>
                <strong>Cần mang theo:</strong> {eventInfo?.documents}
              </p>
            </div>
          </motion.div>
        </motion.section>

        {/* Form Section */}
        {!isSubmitted && (
          <motion.section
            className={styles.formSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CheckinForm 
              event={event} 
              onSuccess={handleFormSuccess}
            />
          </motion.section>
        )}

        {/* Enhanced Timeline */}
        <motion.section
          className={styles.timelineSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Lịch trình thi đấu</h3>
            <p className={styles.sectionSubtitle}>Theo dõi các mốc thời gian quan trọng</p>
          </div>
          <Timeline compact showDescription={false} />
        </motion.section>

        {/* Enhanced Support Section */}
        <motion.section
          className={styles.supportSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className={styles.supportCard}>
            <div className={styles.supportHeader}>
              <div className={styles.supportIcon}>
                <Shield size={24} />
              </div>
              <div>
                <h3 className={styles.supportTitle}>Cần hỗ trợ?</h3>
                <p className={styles.supportSubtitle}>Liên hệ Ban tổ chức để được giúp đỡ</p>
              </div>
            </div>
            
            <div className={styles.supportContacts}>
              <a href="tel:0902031034" className={styles.contactItem}>
                <Phone size={16} />
                <span>0902 031 034</span>
              </a>
              <a href="mailto:tpaentertainment2025@gmail.com" className={styles.contactItem}>
                <Mail size={16} />
                <span>tpaentertainment2025@gmail.com</span>
              </a>
            </div>
            
            <div className={styles.supportNote}>
              <p>TPA Entertainment - 29 đường 12, P. Gò Vấp, TP.HCM</p>
              <p>Thời gian hỗ trợ: 8:00 - 22:00 hàng ngày</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default CheckinEventPage
