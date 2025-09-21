'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Star,
  Crown,
  Calendar,
  Clock,
  Award,
  Heart,
  Users,
  FileText,
  Shield,
  Gavel
} from 'lucide-react'
import styles from './Footer.module.css'

const Footer = () => {
  const [hoveredTimeline, setHoveredTimeline] = useState<number | null>(null)

  const quickLinks = [
    { href: '/', label: 'Trang chủ', icon: Globe },
    { href: '/checkin', label: 'Check-in', icon: Users },
    { href: '/news', label: 'Tin tức', icon: FileText },
    { href: '#dang-ky', label: 'Đăng ký dự thi', icon: Award }
  ]

  const timelineEvents = [
    {
      title: 'Nộp hồ sơ',
      date: '20/08 – 25/11/2025',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Họp báo',
      date: '27/09/2025',
      location: 'Đà Nẵng',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Sơ khảo',
      date: 'HN 09/11 • ĐN 16/11 • HCM 23/11',
      icon: Star,
      color: 'cyan'
    },
    {
      title: 'Công bố kết quả',
      date: '28/11/2025',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Bán kết',
      date: '05/12 – 15/12/2025',
      icon: Crown,
      color: 'orange'
    },
    {
      title: 'Hoạt động thiện nguyện',
      date: '16/12 – 28/12/2025',
      icon: Heart,
      color: 'pink'
    },
    {
      title: 'Chung kết',
      date: '28/12/2025',
      location: 'Cung Tiên Sơn, Đà Nẵng',
      icon: Award,
      color: 'gold'
    }
  ]

  const legalLinks = [
    { href: '#can-cu-phap-ly', label: 'Căn cứ pháp lý', icon: Gavel },
    { href: '#chinh-sach-bao-mat', label: 'Chính sách bảo mật', icon: Shield },
    { href: '#dieu-khoan', label: 'Điều khoản sử dụng', icon: FileText }
  ]

  const contactInfo = [
    {
      type: 'website',
      label: 'Website',
      value: 'hoahausinhvienhoabinhvietnam.vn',
      href: 'https://hoahausinhvienhoabinhvietnam.vn',
      icon: Globe
    },
    {
      type: 'fanpage',
      label: 'Fanpage',
      value: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam',
      href: 'https://facebook.com/hhsvhoabinhvietnam',
      icon: Facebook
    },
    {
      type: 'email',
      label: 'Email',
      value: 'tpaentertainment2025@gmail.com',
      href: 'mailto:tpaentertainment2025@gmail.com',
      icon: Mail
    },
    {
      type: 'hotline',
      label: 'Hotline',
      value: '0902 031 034 (Mr. Sơn Phạm)',
      href: 'tel:0902031034',
      icon: Phone
    },
    {
      type: 'address',
      label: 'Địa chỉ',
      value: '29 đường 12, P. Gò Vấp, TP. HCM',
      href: 'https://maps.google.com/?q=29+đường+12+Gò+Vấp+HCM',
      icon: MapPin
    }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles.container}>
        {/* Brand & CTA Section */}
        <div className={styles.brandSection}>
          <motion.div 
            className={styles.logoGroup}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.logoWrapper}>
              <div className={styles.tingnectLogo}>
                <Image
                  src="/images/logo/TingNect Logo.png"
                  alt="TingNect"
                  width={140}
                  height={38}
                  className={styles.logoImage}
                />
              </div>
              <div className={styles.logoCross}>×</div>
              <div className={styles.tpaLogo}>
                <Image
                  src="/images/logo/Logo_tpa.svg"
                  alt="TPA Entertainment"
                  width={50}
                  height={50}
                  className={styles.logoImage}
                />
              </div>
            </div>
        
          </motion.div>

          <motion.div 
            className={styles.ctaGroup}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.a
              href="https://tingvote.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.cta} ${styles.primaryCTA}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Star size={18} />
              <span>Vote Now</span>
              <ExternalLink size={16} />
              <div className={styles.ctaShine} />
            </motion.a>

            <motion.a
              href="/checkin"
              className={`${styles.cta} ${styles.secondaryCTA}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Award size={18} />
              <span>Check-In</span>
              <div className={styles.ctaShine} />
            </motion.a>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.contentGrid}>
          {/* Quick Links */}
          <motion.div 
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className={styles.sectionTitle}>
              <Globe size={18} />
              Liên kết nhanh
            </h4>
            <div className={styles.linksList}>
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.div
                    key={link.href}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={link.href} className={styles.footerLink}>
                      <Icon size={16} />
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Mini Timeline */}
          <motion.div 
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className={styles.sectionTitle}>
              <Clock size={18} />
              Lịch trình
            </h4>
            <div className={styles.timeline}>
              {timelineEvents.map((event, index) => {
                const Icon = event.icon
                return (
                  <motion.div
                    key={index}
                    className={`${styles.timelineItem} ${styles[`color${event.color}`]}`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    onHoverStart={() => setHoveredTimeline(index)}
                    onHoverEnd={() => setHoveredTimeline(null)}
                  >
                    <div className={styles.timelineIcon}>
                      <Icon size={14} />
                    </div>
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineTitle}>{event.title}</span>
                      <span className={styles.timelineDate}>{event.date}</span>
                      {event.location && (
                        <span className={styles.timelineLocation}>{event.location}</span>
                      )}
                    </div>
                    {hoveredTimeline === index && (
                      <motion.div
                        className={styles.timelineGlow}
                        layoutId="timelineGlow"
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className={styles.sectionTitle}>
              <Phone size={18} />
              Liên hệ
            </h4>
            <div className={styles.contactList}>
              {contactInfo.map((contact) => {
                const Icon = contact.icon
                return (
                  <motion.div
                    key={contact.type}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <a 
                      href={contact.href}
                      className={styles.contactItem}
                      target={contact.type === 'website' || contact.type === 'fanpage' ? '_blank' : undefined}
                      rel={contact.type === 'website' || contact.type === 'fanpage' ? 'noopener noreferrer' : undefined}
                    >
                      <div className={styles.contactIcon}>
                        <Icon size={16} />
                      </div>
                      <div className={styles.contactContent}>
                        <span className={styles.contactLabel}>{contact.label}</span>
                        <span className={styles.contactValue}>{contact.value}</span>
                      </div>
                      {(contact.type === 'website' || contact.type === 'fanpage') && (
                        <ExternalLink size={14} className={styles.externalIcon} />
                      )}
                    </a>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Legal Links */}
          <motion.div 
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className={styles.sectionTitle}>
              <Shield size={18} />
              Pháp lý
            </h4>
            <div className={styles.legalList}>
              {legalLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.div
                    key={link.href}
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={link.href} className={styles.legalLink}>
                      <Icon size={16} />
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <motion.div 
            className={styles.bottomContent}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.copyright}>
              <p>© 2025 TPA Entertainment • TingNect. All rights reserved.</p>
            </div>
            
            <motion.button
              className={styles.backToTop}
              onClick={scrollToTop}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown size={18} />
              <span>Lên đầu trang</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorativeElements}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </div>
    </footer>
  )
}

export default Footer
