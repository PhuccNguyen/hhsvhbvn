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
  Gavel,
  Instagram,
  Youtube
} from 'lucide-react'
import styles from './Footer.module.css'

const Footer = () => {
  const [hoveredTimeline, setHoveredTimeline] = useState<number | null>(null)

  const quickLinks = [
    { href: '/', label: 'Trang chủ', icon: Globe },
    { href: '/checkin/hop-bao', label: 'Họp báo', icon: Users },
    { href: '/checkin/so-khao', label: 'Sơ khảo', icon: Star },
    { href: '/checkin/ban-ket', label: 'Bán kết', icon: Award },
    { href: '/checkin/chung-ket', label: 'Chung kết', icon: Crown }
  ]

  const timelineEvents = [
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
      color: 'blue'
    },
    {
      title: 'Bán kết',
      date: '15/12/2025',
      location: 'Nhà hát Trưng Vương, ĐN',
      icon: Award,
      color: 'green'
    },
    {
      title: 'Thiện nguyện',
      date: '18/12/2025',
      location: 'Đà Nẵng',
      icon: Heart,
      color: 'pink'
    },
    {
      title: 'Chung kết',
      date: '28/12/2025',
      location: 'Cung Tiên Sơn, ĐN',
      icon: Crown,
      color: 'gold'
    }
  ]

  const socialLinks = [
    {
      type: 'website',
      label: 'Website chính thức',
      value: 'hoahausinhvienhoabinh.com',
      href: 'https://hoahausinhvienhoabinh.com',
      icon: Globe
    },
    {
      type: 'fanpage',
      label: 'Facebook Fanpage',
      value: 'HHSV Hòa Bình VN',
      href: 'https://www.facebook.com/hoahausinhvienhoabinhvn',
      icon: Facebook
    },
    {
      type: 'instagram',
      label: 'Instagram',
      value: '@hhsvhoabinhvn',
      href: 'https://www.instagram.com/hoahausinhvienhoabinhvn/',
      icon: Instagram
    },
    {
      type: 'youtube',
      label: 'YouTube Channel',
      value: 'HHSV Hòa Bình VN',
      href: 'https://youtube.com/@hoahausinhvienhoabinhvn',
      icon: Youtube
    }
  ]

  const contactInfo = [
    {
      type: 'company',
      label: 'Đơn vị tổ chức',
      value: 'Công ty TNHH Truyền Thông Giải Trí TPA Entertainment',
      href: '#',
      icon: Award
    },
    {
      type: 'address',
      label: 'Địa chỉ',
      value: '29 đường 12, P.Gò Vấp, TP.HCM',
      href: 'https://maps.google.com/?q=29+đường+12+Gò+Vấp+HCM',
      icon: MapPin
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
    }
  ]

  const legalLinks = [
    { href: '#can-cu-phap-ly', label: 'Căn cứ pháp lý', icon: Gavel },
    { href: '#chinh-sach-bao-mat', label: 'Bảo mật', icon: Shield },
    { href: '#dieu-khoan', label: 'Điều khoản', icon: FileText }
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
              <div className={styles.tpaLogo}>
                <Image
                  src="/images/logo/Logo_tpa.svg"
                  alt="TPA Entertainment"
                  width={36}
                  height={36}
                  className={styles.logoImage}
                />
              </div>
              <div className={styles.logoCross}>×</div>
              <div className={styles.tingnectLogo}>
                <Image
                  src="/images/logo/tingnect-logo.png"
                  alt="TingNect"
                  width={100}
                  height={26}
                  className={styles.logoImage}
                />
              </div>
            </div>
            <div className={styles.brandText}>
              <h3 className={styles.brandTitle}>Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025</h3>
              <p className={styles.brandSubtitle}>Xinh đẹp • Trí tuệ • Bản lĩnh • Nhân ái</p>
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
              <Star size={16} />
              <span>Vote Now</span>
              <div className={styles.ctaShine} />
            </motion.a>

            <motion.a
              href="/checkin/chung-ket"
              className={`${styles.cta} ${styles.secondaryCTA}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown size={16} />
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
              <Globe size={16} />
              Liên kết nhanh
            </h4>
            <div className={styles.linksList}>
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <motion.div
                    key={link.href}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link href={link.href} className={styles.footerLink}>
                      <Icon size={14} />
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div 
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className={styles.sectionTitle}>
              <Calendar size={16} />
              Lịch trình
            </h4>
            <div className={styles.timeline}>
              {timelineEvents.map((event, index) => {
                const Icon = event.icon
                return (
                  <motion.div
                    key={index}
                    className={`${styles.timelineItem} ${styles[`color${event.color}`]}`}
                    whileHover={{ scale: 1.01, x: 2 }}
                    onHoverStart={() => setHoveredTimeline(index)}
                    onHoverEnd={() => setHoveredTimeline(null)}
                  >
                    <div className={styles.timelineIcon}>
                      <Icon size={12} />
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

          {/* Social Media */}
          <motion.div 
            className={styles.section}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className={styles.sectionTitle}>
              <Heart size={16} />
              Theo dõi
            </h4>
            <div className={styles.socialList}>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.div
                    key={social.type}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <a 
                      href={social.href}
                      className={styles.socialItem}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className={styles.socialIcon}>
                        <Icon size={14} />
                      </div>
                      <div className={styles.socialContent}>
                        <span className={styles.socialLabel}>{social.label}</span>
                        <span className={styles.socialValue}>{social.value}</span>
                      </div>
                      <ExternalLink size={12} className={styles.externalIcon} />
                    </a>
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
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h4 className={styles.sectionTitle}>
              <Phone size={16} />
              Liên hệ
            </h4>
            <div className={styles.contactList}>
              {contactInfo.map((contact) => {
                const Icon = contact.icon
                return (
                  <motion.div
                    key={contact.type}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <a 
                      href={contact.href}
                      className={styles.contactItem}
                      target={contact.type === 'address' ? '_blank' : undefined}
                      rel={contact.type === 'address' ? 'noopener noreferrer' : undefined}
                    >
                      <div className={styles.contactIcon}>
                        <Icon size={14} />
                      </div>
                      <div className={styles.contactContent}>
                        <span className={styles.contactLabel}>{contact.label}</span>
                        <span className={styles.contactValue}>{contact.value}</span>
                      </div>
                      {contact.type === 'address' && (
                        <ExternalLink size={12} className={styles.externalIcon} />
                      )}
                    </a>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Legal Section - Mobile Optimized */}
        <motion.div 
          className={styles.legalSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className={styles.legalList}>
            {legalLinks.map((link) => {
              const Icon = link.icon
              return (
                <motion.div
                  key={link.href}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link href={link.href} className={styles.legalLink}>
                    <Icon size={14} />
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
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
              <p>© 2025 TPA Entertainment × TingNect</p>
              <span>All rights reserved.</span>
            </div>
            
            <motion.button
              className={styles.backToTop}
              onClick={scrollToTop}
              whileHover={{ y: -2, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown size={16} />
              <span>Lên đầu</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={styles.decorativeElements}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
      </div>
    </footer>
  )
}

export default Footer
