'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Sparkles, Heart, Star, Crown } from 'lucide-react'
import styles from './Purpose.module.css'

const Purpose = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const purposeItems = [
    {
      id: 'first-time',
      icon: <Crown size={20} />,
      title: 'Cuộc thi Hòa Bình đầu tiên tại Việt Nam',
      description: 'Lần đầu tiên tại Việt Nam, một cuộc thi mang biểu tượng Hòa Bình dành cho nữ sinh viên Việt Nam – nơi tôn vinh trí tuệ, nhan sắc và tinh thần hòa bình.',
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      id: 'tourism',
      icon: <Star size={20} />,
      title: 'Quảng bá du lịch & văn hóa Việt Nam',
      description: 'Quảng bá du lịch Đà Nẵng và di sản – văn hóa Việt Nam thông qua các hoạt động truyền thông của cuộc thi.',
      gradient: 'from-blue-400 to-indigo-500'
    }
  ]

  const meaningItems = [
    {
      id: 'playground',
      icon: <Heart size={20} />,
      title: 'Nơi uy tín để phát triển bản thân',
      description: 'Nơi uy tín để sinh viên giao lưu, học hỏi, hoàn thiện bản thân, phát huy tài năng – vẻ đẹp, xây dựng nhân hiệu cho tương lai.',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'talents',
      icon: <Sparkles size={20} />,
      title: 'Tìm kiếm gương mặt trẻ tài năng',
      description: 'Tìm kiếm gương mặt trẻ tài năng, khuyến khích sinh viên tham gia hoạt động về nguồn – văn hóa – giải trí lành mạnh, ca ngợi trí tuệ và đạo đức của sinh viên Việt Nam trong công cuộc phát triển đất nước.',
      gradient: 'from-amber-400 to-orange-500'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  }

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      x: 30,
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  }

  return (
    <section className={styles.purposeSection} ref={sectionRef}>
      {/* Background */}
      <div className={styles.backgroundContainer}>
        <div className={styles.bgImage} />
        <div className={styles.overlay} />
        <div className={styles.particlesContainer}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`${styles.particle} ${styles[`particle${(i % 4) + 1}`]}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className={styles.title}>
            Mục đích & Ý nghĩa
          </h2>
          <p className={styles.subtitle}>
            Tôn vinh trí tuệ, nhan sắc & tinh thần hòa bình
          </p>
        </motion.div>

        <div className={styles.contentWrapper}>
          {/* Content Cards */}
          <motion.div
            className={styles.contentArea}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Purpose Section */}
            <motion.div className={styles.contentBlock} variants={itemVariants}>
              <div className={styles.blockHeader}>
                <div className={styles.blockIcon}>
                  <Crown size={24} />
                </div>
                <h3 className={styles.blockTitle}>Mục đích</h3>
              </div>
              
              <div className={styles.itemsGrid}>
                {purposeItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={styles.purposeCard}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -4, 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className={`${styles.cardIcon} ${styles[item.gradient]}`}>
                      {item.icon}
                    </div>
                    <div className={styles.cardContent}>
                      <h4 className={styles.cardTitle}>{item.title}</h4>
                      <p className={styles.cardDescription}>{item.description}</p>
                    </div>
                    <div className={styles.cardGlow} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Meaning Section */}
            <motion.div className={styles.contentBlock} variants={itemVariants}>
              <div className={styles.blockHeader}>
                <div className={styles.blockIcon}>
                  <Sparkles size={24} />
                </div>
                <h3 className={styles.blockTitle}>Ý nghĩa</h3>
              </div>
              
              <div className={styles.itemsGrid}>
                {meaningItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={styles.purposeCard}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -4, 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className={`${styles.cardIcon} ${styles[item.gradient]}`}>
                      {item.icon}
                    </div>
                    <div className={styles.cardContent}>
                      <h4 className={styles.cardTitle}>{item.title}</h4>
                      <p className={styles.cardDescription}>{item.description}</p>
                    </div>
                    <div className={styles.cardGlow} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Beauty Queen Image */}
          <motion.div
            className={styles.imageArea}
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <div className={styles.imageContainer}>
              <div className={styles.imageFrame}>
                <Image
                  src="/images/nguoinoitieng/hoahauubg.jpg"
                  alt="Hoa hậu đại diện tinh thần hòa bình và trí tuệ"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 500px"
                  className={styles.beautyImage}
                  priority={false}
                  loading="lazy"
                />
                <div className={styles.imageOverlay} />
                <div className={styles.goldBorder} />
              </div>
              
              <motion.div 
                className={styles.imageCaption}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Sparkles size={14} />
                <span>Đồng hành cùng Hòa Bình – Trí tuệ – Nhan sắc</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Purpose
