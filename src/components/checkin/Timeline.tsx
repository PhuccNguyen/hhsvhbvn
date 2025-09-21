'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Crown, Trophy } from 'lucide-react'
import { events } from '@/data/events'
import StatusPill from './StatusPill'
import styles from './Timeline.module.css'

interface TimelineProps {
  compact?: boolean
  showDescription?: boolean
}

const Timeline = ({ compact = false, showDescription = false }: TimelineProps) => {
  const getIcon = (eventId: string) => {
    switch (eventId) {
      case 'hop-bao': return Calendar
      case 'so-khao': return Users
      case 'ban-ket': return Crown
      case 'chung-ket': return Trophy
      default: return Calendar
    }
  }

  return (
    <div className={`${styles.timeline} ${compact ? styles.compact : ''}`}>
      {!compact && (
        <motion.div
          className={styles.timelineHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className={styles.timelineTitle}>Lịch trình sự kiện</h3>
        </motion.div>
      )}

      <div className={styles.timelineList}>
        {events.map((event, index) => {
          const Icon = getIcon(event.id)
          
          return (
            <motion.div
              key={event.id}
              className={`${styles.timelineItem} ${compact ? styles.compactItem : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className={styles.timelineIcon}>
                <Icon size={compact ? 14 : 16} />
              </div>
              
              <div className={styles.timelineContent}>
                <div className={styles.timelineMain}>
                  <span className={styles.timelineName}>{event.name}</span>
                  <StatusPill 
                    status={event.status} 
                    size={compact ? 'small' : 'medium'}
                    showIcon={false}
                  />
                </div>
                
                <div className={styles.timelineInfo}>
                  <span className={styles.timelineDate}>{event.date}</span>
                  {showDescription && !compact && (
                    <span className={styles.timelineDesc}>{event.description}</span>
                  )}
                </div>
              </div>

              {!compact && index < events.length - 1 && (
                <div className={styles.timelineConnector} />
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Timeline
