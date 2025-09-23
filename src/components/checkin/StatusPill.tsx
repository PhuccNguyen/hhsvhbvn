'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Circle, 
  AlertCircle,
  Timer,
  Calendar,
  Users
} from 'lucide-react'
import { EventInfo, EventStatus } from '@/lib/types'
import { getEventStatus } from '@/lib/eventUtils'
import styles from './StatusPill.module.css'

interface StatusPillProps {
  event?: EventInfo
  status?: 'open' | 'upcoming' | 'closed' | 'ending-soon'
  showIcon?: boolean
  showCount?: boolean
  showTimeLeft?: boolean
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

const StatusPill = ({ 
  event,
  status,
  showIcon = true,
  showCount = false,
  showTimeLeft = false,
  size = 'medium',
  animated = true
}: StatusPillProps) => {
  const [eventStatus, setEventStatus] = useState<EventStatus | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update status based on real-time data
    if (event) {
      const realTimeStatus = getEventStatus(event, currentTime)
      setEventStatus(realTimeStatus)
    }
  }, [event, currentTime])

  useEffect(() => {
    // Update time every minute for real-time countdown
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const getStatusConfig = () => {
    const currentStatus = status || eventStatus?.status || 'closed'
    
    switch (currentStatus) {
      case 'open':
        return {
          text: 'Đang nhận đăng ký',
          icon: Circle,
          className: styles.open,
          pulse: true
        }
      case 'ending-soon':
        return {
          text: eventStatus?.hoursLeft 
            ? `Còn ${eventStatus.hoursLeft}h` 
            : eventStatus?.daysLeft 
            ? `Còn ${eventStatus.daysLeft} ngày`
            : 'Sắp đóng',
          icon: Timer,
          className: styles.endingSoon,
          urgent: true
        }
      case 'upcoming':
        return {
          text: 'Sắp mở diễn ra có thể đăng ký',
          icon: Clock,
          className: styles.upcoming
        }
      case 'closed':
        return {
          text: 'Đã kết thúc',
          icon: XCircle,
          className: styles.closed
        }
      default:
        return {
          text: 'Không xác định',
          icon: AlertCircle,
          className: styles.unknown
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const getCapacityInfo = () => {
    if (!event?.maxCapacity || !showCount) return null
    
    const currentCount = event.currentCount || 0
    const maxCapacity = event.maxCapacity
    const percentage = Math.round((currentCount / maxCapacity) * 100)
    
    if (percentage >= 95) {
      return { text: 'Gần đầy', className: styles.almostFull, urgent: true }
    } else if (percentage >= 80) {
      return { text: `${percentage}%`, className: styles.filling }
    } else {
      return { text: `${currentCount}/${maxCapacity}`, className: styles.available }
    }
  }

  const capacityInfo = getCapacityInfo()

  return (
    <motion.div
      className={`${styles.pill} ${config.className} ${styles[size]} ${
        config.urgent || capacityInfo?.urgent ? styles.urgent : ''
      }`}
      initial={animated ? { opacity: 0, scale: 0.9 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.3 }}
      whileHover={animated ? { scale: 1.05 } : {}}
    >
      <div className={styles.pillContent}>
        {showIcon && (
          <motion.div 
            className={styles.iconWrapper}
            animate={config.pulse ? {
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{
              duration: config.pulse ? 2 : 0,
              repeat: config.pulse ? Infinity : 0,
              ease: "easeInOut"
            }}
          >
            <Icon size={size === 'large' ? 16 : size === 'medium' ? 14 : 12} />
          </motion.div>
        )}
        
        <span className={styles.statusText}>{config.text}</span>
        
        {showTimeLeft && eventStatus?.message && (
          <span className={styles.timeInfo}>{eventStatus.message}</span>
        )}
      </div>

      {capacityInfo && (
        <motion.div 
          className={`${styles.capacityInfo} ${capacityInfo.className}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Users size={10} />
          <span>{capacityInfo.text}</span>
        </motion.div>
      )}

      {/* Animated elements */}
      {config.pulse && (
        <motion.div
          className={styles.liveDot}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {config.urgent && (
        <motion.div
          className={styles.urgentPulse}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Shine effect for interactive states */}
      <div className={styles.shine} />
    </motion.div>
  )
}

export default StatusPill
