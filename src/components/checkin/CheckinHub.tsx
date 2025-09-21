'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, 
  Clock, 
  Users, 
  ArrowRight,
  Calendar,
  Crown,
  Trophy,
  HelpCircle,
  ChevronRight
} from 'lucide-react'
import { events } from '@/data/events'
import StatusPill from './StatusPill'
import Timeline from './Timeline'
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

  const getCountdownText = (eventId: string) => {
    // Trong thực tế, bạn sẽ tính toán thời gian thực
    const countdowns = {
      'hop-bao': 'Còn 12 ngày',
      'so-khao': 'Mở T10/2025',
      'ban-ket': 'Mở T12/2025', 
      'chung-ket': 'Mở T12/2025'
    }
    return countdowns[eventId as keyof typeof countdowns]
  }

  const faqItems = [
    {
      question: 'Tôi cần gì để check-in?',
      answer: 'Họ tên, SĐT, Email, tick xác nhận tham dự.'
    },
    {
      question: 'Dữ liệu của tôi có bảo mật không?',
      answer: 'Có. Chỉ dùng cho công tác tổ chức.'
    },
    {
      question: 'Tôi đã gửi nhầm?',
      answer: 'Liên hệ BTC: 0902 031 034 / tpaentertainment2025@gmail.com'
    }
  ]

  return (
    <div className={styles.hubContainer}>
      {/* Background */}
      <div className={styles.backgroundContainer}>
        <div className={styles.bgImage} />
        <div className={styles.overlay} />
      </div>

      <div className={styles.container}>
        {/* Hero Section */}
        <motion.section 
          className={styles.hero}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.heroContent}>
            <motion.div
              className={styles.heroIcon}
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Users size={32} />
            </motion.div>
            
            <h1 className={styles.heroTitle}>
              Check-in HHSV 2025
            </h1>
            
            <p className={styles.heroSubtitle}>
              Chọn sự kiện để xác nhận tham dự. Hoàn tất trong ~30 giây.
            </p>
            
            <motion.div
              className={styles.heroBadge}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Shield size={14} />
              <span>Bảo mật • Dữ liệu chỉ phục vụ công tác tổ chức</span>
            </motion.div>
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
            <h2 className={styles.sectionTitle}>Chọn sự kiện</h2>
            <p className={styles.sectionSubtitle}>
              Bấm vào sự kiện để điền form check-in
            </p>
          </div>

          <div className={styles.eventsGrid}>
            {events.map((event, index) => {
              const Icon = getEventIcon(event.id)
              const isDisabled = event.status === 'closed'
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={!isDisabled ? { y: -6, scale: 1.02 } : {}}
                  className={styles.eventCardWrapper}
                >
                  {isDisabled ? (
                    <div className={`${styles.eventCard} ${styles.disabled}`}>
                      <div className={styles.eventCardIcon}>
                        <Icon size={24} />
                      </div>
                      
                      <div className={styles.eventCardContent}>
                        <div className={styles.eventCardHeader}>
                          <h3 className={styles.eventCardTitle}>{event.name}</h3>
                          <StatusPill status={event.status} size="medium" />
                        </div>
                        
                        <p className={styles.eventCardDescription}>
                          {event.description}
                        </p>
                        
                        <div className={styles.eventCardDate}>
                          <Clock size={14} />
                          <span>{event.date}</span>
                        </div>
                      </div>
                      
                      <div className={styles.eventCardAction}>
                        <span className={styles.disabledText}>
                          Đã kết thúc • Xem sự kiện khác
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Link 
                      href={`/checkin/${event.slug}`}
                      className={styles.eventCard}
                    >
                      <div className={styles.eventCardIcon}>
                        <Icon size={24} />
                      </div>
                      
                      <div className={styles.eventCardContent}>
                        <div className={styles.eventCardHeader}>
                          <h3 className={styles.eventCardTitle}>{event.name}</h3>
                          <StatusPill status={event.status} size="medium" />
                        </div>
                        
                        <p className={styles.eventCardDescription}>
                          {event.description}
                        </p>
                        
                        <div className={styles.eventCardMeta}>
                          <div className={styles.eventCardDate}>
                            <Clock size={14} />
                            <span>{event.date}</span>
                          </div>
                          
                          {event.status === 'open' && (
                            <div className={styles.eventCardCountdown}>
                              <span className={styles.liveIndicator}>LIVE</span>
                              <span>{getCountdownText(event.id)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className={styles.eventCardAction}>
                        <span>Vào trang check-in</span>
                        <ArrowRight size={16} />
                      </div>
                    </Link>
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Quick FAQ */}
        <motion.section
          className={styles.faqSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Câu hỏi nhanh</h2>
          </div>

          <div className={styles.faqGrid}>
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className={styles.faqCard}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ x: 4 }}
              >
                <div className={styles.faqIcon}>
                  <HelpCircle size={16} />
                </div>
                <div className={styles.faqContent}>
                  <h4 className={styles.faqQuestion}>{item.question}</h4>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </div>
                <ChevronRight size={14} className={styles.faqArrow} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}

export default CheckinHub
