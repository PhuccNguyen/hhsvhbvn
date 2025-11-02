'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Users,
  Globe,
  MapPin,
  Award,
  TrendingUp,
  Calendar,
  Play,
  Crown,
  CheckCircle,
  ArrowRight,
  Mic,
  Star,
  Heart
} from 'lucide-react'
import styles from './HeroSection.module.css'

const HeroSection = () => {
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()

  const yMobile = useTransform(scrollY, [0, 300], [0, 12])
  const yDesktop = useTransform(scrollY, [0, 300], [0, 15])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const highlights = [
    { icon: Users, text: '1000+ thí sinh' },
    { icon: Globe, text: 'Quy mô toàn quốc' },
    { icon: MapPin, text: '4 thành phố lớn' },
    { icon: Award, text: 'Giải thưởng 2 tỷ đồng' },
    { icon: TrendingUp, text: 'Cơ hội nghề nghiệp' }
  ]

  const timelineItems = [
    {
      icon: Play,
      label: 'Tuyển sinh',
      status: 'Đang mở',
      isActive: true
    },
    {
      icon: Mic,
      label: 'Họp báo',
      status: '17h00-21h00',
      details: '27/09/2025 - Đà Nẵng',
      isActive: true,
      link: 'https://hhsvhbvn.tingnect.com/checkin/hop-bao'
    },
    {
      icon: Users,
      label: 'Sơ Tuyển',
      status: '27/09-25/11',
      details: 'Sau họp báo, trước sơ khảo',
      isActive: true,
      link: 'https://hhsvhbvn.tingnect.com/checkin/so-tuyen'
    },
    {
      icon: Calendar,
      label: 'Sơ khảo',
      status: '06/11-30/11',
      details: 'HN • ĐN • HCM • CT',
      isActive: true,
      link: 'https://hhsvhbvn.tingnect.com/checkin/so-khao'
    },
    {
      icon: Star,
      label: 'Công bố kết quả sơ khảo',
      status: '30/11/2025',
      isActive: false
    },
    {
      icon: Award,
      label: 'Bán kết',
      status: '05–15/12',
      details: 'Nhà hát Trưng Vương, Đà Nẵng',
      isActive: false,
      link: 'https://hhsvhbvn.tingnect.com/checkin/ban-ket'
    },
    {
      icon: Heart,
      label: 'Hoạt động thiện nguyện',
      status: '16–28/12',
      isActive: false
    },
    {
      icon: Crown,
      label: 'Chung kết',
      status: '16-28/12',
      details: 'Cung Tiên Sơn, Đà Nẵng',
      isActive: false,
      link: 'https://hhsvhbvn.tingnect.com/checkin/chung-ket'
    }
  ]


  return (
    <section className={styles.hero} id="hero">
      {/* Mobile Layout */}
      <div className={styles.mobileLayout}>
        {/* Section 1: Clean Banner */}
        <div className={styles.mobileBannerSection}>
          <Image
            src="/images/hero/banner_hero.png"
            alt="Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025"
            width={1920}
            height={720}
            priority
            className={styles.mobileBannerImage}
            sizes="100vw"
          />
        </div>

        {/* Section 2: Content with Blurred Background */}
        <div className={styles.mobileContentSection}>
          <div className={styles.mobileBlurredBg}>
            <Image
              src="/images/hero/banner_hero.png"
              alt=""
              fill
              className={styles.mobileBlurredImage}
              sizes="100vw"
            />
            <div className={styles.mobileContentOverlay} />
          </div>

          <motion.div
            className={styles.mobileContent}
            style={{ y: yMobile }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Frosted Content Card */}
            <div className={styles.frostedCard}>
              {/* Headline & Slogan */}
              <motion.div
                className={styles.headerSectionmobile}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h1 className={styles.headline}>
                  Hoa Hậu Sinh Viên<br />Hòa Bình Việt Nam 2025
                </h1>
                <p className={styles.slogan}>
                  ✦ Xinh đẹp • Trí tuệ • Bản lĩnh • Nhân ái ✦
                </p>
              </motion.div>


              {/* Highlights */}
              <motion.div
                className={styles.highlights}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {highlights.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={index} className={styles.highlightChip}>
                      <Icon size={14} />
                      <span>{item.text}</span>
                    </div>
                  )
                })}
                <div className={styles.highlightChip}>
                  <MapPin size={14} />
                  <span>Hà Nội • Đà Nẵng • TP.HCM • Cần Thơ</span>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                className={styles.ctaSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Link href="/checkin?src=hero" className={styles.primaryCTA}>
                  <motion.div
                    className={styles.ctaButton}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle size={18} />
                    <span>Check-in ngay</span>
                    <ArrowRight size={16} />
                  </motion.div>
                </Link>
                <p className={styles.ctaMicrocopy}>Hoàn tất trong 30 giây</p>
                <p className={styles.eligibilityNote}>
                  Dành cho nữ sinh viên Việt Nam 18–25 tuổi
                </p>
              </motion.div>
              {/* Mini Timeline */}
              <motion.div
                className={styles.miniTimeline}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {timelineItems.map((item, index) => {
                  const Icon = item.icon
                  const content = (
                    <motion.div
                      className={`${styles.timelineItem} ${item.isActive ? styles.active : ''}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={styles.timelineIcon}>
                        <Icon size={16} />
                      </div>
                      <div className={styles.timelineContent}>
                        <span className={styles.timelineLabel}>{item.label}</span>
                        <span className={styles.timelineStatus}>{item.status}</span>
                        {item.details && (
                          <span className={styles.timelineDetails}>{item.details}</span>
                        )}
                      </div>
                      {item.link && (
                        <div className={styles.timelineButton}>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ArrowRight size={14} />
                          </motion.div>
                        </div>
                      )}
                    </motion.div>
                  )
                  return item.link ? (
                    <Link key={index} href={item.link} className={styles.timelineLink}>
                      {content}
                    </Link>
                  ) : (
                    <div key={index}>{content}</div>
                  )
                })}
              </motion.div>
              {/* Credits */}
              <motion.div
                className={styles.credits}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className={styles.creditItem}>
                  <span className={styles.creditLabel}>Tổ chức:</span>
                  <Image
                    src="/images/logo/Logo_tpa.svg"
                    alt="TPA Entertainment logo"
                    width={30}
                    height={30}
                    className={styles.creditLogoTPA}
                  />
                  <span className={styles.creditName}>TPA Entertainment</span>
                </div>
                <div className={styles.creditItem}>
                  <span className={styles.creditLabel}>Công nghệ:</span>
                  <Image
                    src="/images/logo/tingnectcon.png"
                    alt="TingNect logo"
                    width={20}
                    height={20}
                    className={styles.creditLogoTingNect}
                  />
                  <span className={styles.creditName}>TingNect</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className={styles.desktopLayout}>
        <div className={styles.desktopBackground}>
          <Image
            src="/images/hero/banner_hero.png"
            alt="Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025"
            fill
            priority
            className={styles.desktopBannerImage}
            sizes="100vw"
          />
          <div className={styles.desktopOverlay} />
        </div>

        <div className={styles.desktopContainer}>
          <motion.div
            className={styles.desktopContent}
            style={{ y: yDesktop }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Headline & Slogan */}
            <motion.div
              className={styles.headerSection}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h1 className={styles.headline}>
                Cuộc thi danh giá dành cho nữ sinh viên Việt Nam
              </h1>
              <p className={styles.slogan}>
                Xinh đẹp • Trí tuệ • Bản lĩnh • Nhân ái • Yêu Hòa Bình
              </p>
            </motion.div>

            {/* Highlights */}
            <motion.div
              className={styles.highlights}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {highlights.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className={styles.highlightChip}>
                    <Icon size={16} />
                    <span>{item.text}</span>
                  </div>
                )
              })}
              <div className={styles.highlightChip}>
                <MapPin size={16} />
                <span>Hà Nội • Đà Nẵng • TP.HCM • Cần Thơ</span>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className={styles.ctaSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/checkin?src=hero" className={styles.primaryCTA}>
                <motion.div
                  className={styles.ctaButton}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CheckCircle size={20} />
                  <span>Check-in ngay</span>
                  <ArrowRight size={18} />
                </motion.div>
              </Link>
              <p className={styles.ctaMicrocopy}>Hoàn tất trong 30 giây</p>
              <p className={styles.eligibilityNote}>
                Dành cho nữ sinh viên Việt Nam 18–25 tuổi
              </p>
            </motion.div>


            {/* Credits */}
            <motion.div
              className={styles.credits}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className={styles.creditItem}>
                <span className={styles.creditLabel}>Tổ chức:</span>
                <Image
                  src="/images/logo/Logo_tpa.svg"
                  alt="TPA Entertainment logo"
                  width={35}
                  height={35}
                  className={styles.creditLogoTPA}
                />
                <span className={styles.creditName}>TPA Entertainment</span>
              </div>
              <div className={styles.creditItem}>
                <span className={styles.creditLabel}>Công nghệ:</span>
                <Image
                  src="/images/logo/tingnectcon.png"
                  alt="TingNect logo"
                  width={28}
                  height={28}
                  className={styles.creditLogoTingNect}
                />
                <span className={styles.creditName}>TingNect</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection