'use client'

import { motion } from 'framer-motion'
import { Clock, CheckCircle, XCircle, Circle } from 'lucide-react'
import { EventStatus } from '@/lib/types'
import styles from './StatusPill.module.css'

interface StatusPillProps {
  status: EventStatus
  showIcon?: boolean
  size?: 'small' | 'medium' | 'large'
}

const StatusPill = ({ status, showIcon = true, size = 'medium' }: StatusPillProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'open':
        return {
          text: 'Đang nhận đăng ký',
          icon: Circle,
          className: styles.open
        }
      case 'upcoming':
        return {
          text: 'Sắp mở đăng ký',
          icon: Clock,
          className: styles.upcoming
        }
      case 'closed':
        return {
          text: 'Đã kết thúc',
          icon: XCircle,
          className: styles.closed
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <motion.div
      className={`${styles.pill} ${config.className} ${styles[size]}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showIcon && <Icon size={size === 'large' ? 16 : size === 'medium' ? 14 : 12} />}
      <span>{config.text}</span>
      {status === 'open' && (
        <motion.div
          className={styles.liveDot}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )
}

export default StatusPill
