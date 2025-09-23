'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import {
  Shield,
  Clock,
  Users,
  ArrowRight,
  Calendar,
  Crown,
  Trophy,
  HelpCircle,
  ChevronRight,
  Star,
  Heart,
  Phone,
  Mail,
  MapPin,
  Award
} from 'lucide-react'
import { events } from '@/data/events'
import StatusPill from './StatusPill'
import styles from './CheckinHub.module.css'

const CheckinHub = () => {
  const getEventIcon = (eventId: string) => {
    switch (eventId) {
      case 'hop-bao': return Calendar
      case 'so-khao': return Users
      case 'ban-ket': return Crown
      case 'chung-ket': return Trophy
      default: return Calendar
    }
  }

  const getEventColor = (eventId: string) => {
    switch (eventId) {
      case 'hop-bao': return 'purple'
      case 'so-khao': return 'blue'
      case 'ban-ket': return 'orange'
      case 'chung-ket': return 'gold'
      default: return 'blue'
    }
  }

  const getCountdownText = (eventId: string) => {
    const countdowns = {
      'hop-bao': 'Đang Diễn Ra',
      'so-khao': 'Mở đăng ký có thể đăng ký',
      'ban-ket': 'Sắp diễn ra có thể đăng ký',
      'chung-ket': 'Sắp diễn ra có thể đăng ký'
    }
    return countdowns[eventId as keyof typeof countdowns]
  }

  const timelineEvents = [
    { name: 'Họp báo', date: '27/09/2025', status: 'completed', icon: Calendar },
    { name: 'Sơ khảo', date: '05/10-25/11/2025', status: 'active', icon: Users },
    { name: 'Bán kết', date: '15/12/2025', status: 'upcoming', icon: Crown },
    { name: 'Chung kết', date: '28/12/2025', status: 'upcoming', icon: Trophy }
  ]

  const quickStats = [
    { icon: Users, label: 'Thí sinh đăng ký', value: '500+', color: 'blue' },
    { icon: MapPin, label: 'Khu vực tổ chức', value: '3', color: 'green' },
    { icon: Award, label: 'Giải thưởng', value: '2 tỷ+', color: 'gold' },
    { icon: Heart, label: 'Thiện nguyện', value: '1M+', color: 'pink' }
  ]

  const faqItems = [
    {
      question: 'Tôi cần gì để check-in?',
      answer: 'Chỉ cần họ tên, số điện thoại, email và xác nhận tham dự. Hoàn tất trong ~30 giây.'
    },
    {
      question: 'Thông tin của tôi có được bảo mật?',
      answer: 'Hoàn toàn bảo mật. Dữ liệu chỉ phục vụ công tác tổ chức sự kiện và không chia sẻ với bên thứ ba.'
    },
    {
      question: 'Tôi check-in nhầm hoặc cần sửa thông tin?',
      answer: 'Liên hệ ngay BTC qua Hotline: 0902 031 034 hoặc email: tpaentertainment2025@gmail.com'
    },
    {
      question: 'Tôi có thể check-in nhiều sự kiện không?',
      answer: 'Có thể. Mỗi sự kiện có form check-in riêng, bạn có thể đăng ký tham dự nhiều sự kiện.'
    }
  ]

  const contactInfo = [
    { icon: Phone, label: 'Hotline', value: '0902 031 034', type: 'tel:0902031034' },
    { icon: Mail, label: 'Email', value: 'tpaentertainment2025@gmail.com', type: 'mailto:tpaentertainment2025@gmail.com' }
  ]

  return (
    <div className={styles.hubContainer}>
      {/* Background */}
      <div className={styles.backgroundContainer}>
        <div className={styles.overlay} />
        <div className={styles.gradientOverlay} />
      </div>

      <div className={styles.container}>

          {/* Hero Section */}          {/* Hero Section */}

        <div className={styles.pageBg} aria-label="Check-in HHSV 2025">
          <motion.section
            className={styles.hero}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.heroInner}>
              <p className={styles.kicker}>Check-in sự kiện</p>

              <h1 className={styles.heroTitle}>
                <span>Hoa Hậu Sinh Viên</span><br />
                <span>Hòa Bình Việt Nam 2025</span>
              </h1>

              <p className={styles.heroSubtitle}>
                Vui lòng điền thông tin chính xác để BTC xác nhận tham dự.
              </p>
            </div>
          </motion.section>
        </div >

        {/* Timeline Section - Compact */}
        <motion.section
          className={styles.timelineSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Lộ trình Check In Sự Kiện</h2>
            <p className={styles.sectionSubtitle}>Theo dõi các mốc thời gian quan trọng</p>
          </div>

          <div className={styles.timelineGrid}>
            {timelineEvents.map((event, index) => {
              const Icon = event.icon
              return (
                <motion.div
                  key={index}
                  className={`${styles.timelineCard} ${styles[event.status]}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <div className={styles.timelineCardIcon}>
                    <Icon size={14} />
                  </div>
                  <div className={styles.timelineCardContent}>
                    <span className={styles.timelineCardName}>{event.name}</span>
                    <span className={styles.timelineCardDate}>{event.date}</span>
                  </div>
                  <div className={`${styles.timelineStatus} ${styles[event.status]}`} />
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Events Grid */}
        <motion.section
          className={styles.eventsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Chọn sự kiện check-in</h2>
            <p className={styles.sectionSubtitle}>
              Bấm vào sự kiện để điền form xác nhận tham dự
            </p>
          </div>

          <div className={styles.eventsGrid}>
            {events.map((event, index) => {
              const Icon = getEventIcon(event.id)
              const colorClass = getEventColor(event.id)
              const isDisabled = event.status === 'closed'

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={!isDisabled ? { y: -4, scale: 1.02 } : {}}
                  className={styles.eventCardWrapper}
                >
                  {isDisabled ? (
                    <div className={`${styles.eventCard} ${styles.disabled}`}>
                      <div className={styles.eventCardHeader}>
                        <StatusPill status={event.status} size="small" />
                      </div>

                      <div className={styles.eventCardContent}>
                        <h3 className={styles.eventCardTitle}>{event.name}</h3>
                        <p className={styles.eventCardDescription}>{event.description}</p>

                        <div className={styles.eventCardMeta}>
                          <div className={styles.eventCardDate}>
                            <Clock size={12} />
                            <span>{event.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.eventCardFooter}>
                        <span className={styles.disabledText}>Đã kết thúc</span>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={`/checkin/${event.slug}`}
                      className={`${styles.eventCard} ${styles[colorClass]}`}
                    >
                      <div className={styles.eventCardHeader}>
                        <div className={styles.eventCardIcon}>
                          <Icon size={20} />
                        </div>
                        <StatusPill status={event.status} size="small" />
                      </div>

                      <div className={styles.eventCardContent}>
                        <h3 className={styles.eventCardTitle}>{event.name}</h3>
                        <p className={styles.eventCardDescription}>{event.description}</p>

                        <div className={styles.eventCardMeta}>
                          <div className={styles.eventCardDate}>
                            <Clock size={12} />
                            <span>{event.date}</span>
                          </div>

                          {event.status === 'open' && (
                            <div className={styles.eventCardCountdown}>
                              <div className={styles.liveIndicator} />
                              <span>{getCountdownText(event.id)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.eventCardFooter}>
                        <span className={styles.actionText}>Check-in ngay</span>
                        <ArrowRight size={14} />
                      </div>
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          className={styles.faqSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Câu hỏi thường gặp</h2>
            <p className={styles.sectionSubtitle}>Giải đáp nhanh các thắc mắc của bạn</p>
          </div>

          <div className={styles.faqGrid}>
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className={styles.faqCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -2, scale: 1.01 }}
              >
                <div className={styles.faqIcon}>
                  <HelpCircle size={16} />
                </div>
                <div className={styles.faqContent}>
                  <h4 className={styles.faqQuestion}>{item.question}</h4>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          className={styles.contactSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <h3 className={styles.contactTitle}>Cần hỗ trợ?</h3>
              <p className={styles.contactSubtitle}>Liên hệ BTC để được hỗ trợ nhanh nhất</p>
            </div>

            <div className={styles.contactList}>
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon
                return (
                  <motion.a
                    key={index}
                    href={contact.type}
                    className={styles.contactItem}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={styles.contactItemIcon}>
                      <Icon size={16} />
                    </div>
                    <div className={styles.contactItemContent}>
                      <span className={styles.contactItemLabel}>{contact.label}</span>
                      <span className={styles.contactItemValue}>{contact.value}</span>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default CheckinHub
