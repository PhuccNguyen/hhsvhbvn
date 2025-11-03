'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Heart, Star, Crown } from 'lucide-react'
import styles from './Purpose.module.css'

const Purpose = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  const purposeItems = [
    {
      id: 'honor-students',
      icon: <Crown size={20} />,
      title: 'Tôn Vinh Sinh Viên Việt Nam',
      description: 'Khám phá và tôn vinh vẻ đẹp toàn diện của nữ sinh viên: Nhan sắc - Trí tuệ - Bản lĩnh - Lòng nhân ái - Yêu nước - Yêu Hòa bình.',
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      id: 'peace-message',
      icon: <Heart size={20} />,
      title: 'Lan Tỏa Thông Điệp Hòa Bình',
      description: 'Mang đến hành trình ý nghĩa, nơi sinh viên trở thành đại sứ lan tỏa giá trị hòa bình, nhân văn và niềm tự hào dân tộc.',
      gradient: 'from-blue-400 to-indigo-500'
    }
  ]

  const meaningItems = [
    {
      id: 'national-opportunity',
      icon: <Star size={20} />,
      title: 'Cơ Hội Tỏa Sáng cho Sinh Viên Việt Nam Toàn Quốc',
      description: 'Lần đầu tiên tổ chức với quy mô quốc gia, cuộc thi mở ra sân chơi lớn để nữ sinh viên thể hiện tài năng, bản lĩnh và khát vọng tuổi trẻ.',
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      id: 'personal-journey',
      icon: <Sparkles size={20} />,
      title: 'Hành Trình Khám Phá, Khai Mở, Phát Triển Bản Thân',
      description: 'Thông qua các vòng thi và chương trình truyền hình thực tế, thí sinh được đào tạo, trải nghiệm và hoàn thiện bản thân, góp phần lan tỏa thông điệp hòa bình và trở thành nguồn cảm hứng tích cực cho thế hệ sinh viên Việt Nam.',
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
            Giới Thiệu Cuộc Thi
          </h2>
          <p className={styles.subtitle}>
            Sân chơi quy mô quốc gia đầu tiên dành cho nữ sinh viên Việt Nam - Tôn vinh vẻ đẹp: Xinh đẹp – Trí tuệ – Bản lĩnh – Nhân ái
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
                <h3 className={styles.blockTitle}>Sứ Mệnh</h3>
              </div>
              
              <div className={styles.itemsGrid}>
                {purposeItems.map((item) => (
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
                <h3 className={styles.blockTitle}>Giá Trị</h3>
              </div>
              
              <div className={styles.itemsGrid}>
                {meaningItems.map((item) => (
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
                <iframe
                  src="https://www.youtube.com/embed/dDwm5Hf2MpM?si=EHVH6cu1DrM6OaN6&controls=1&rel=0&modestbranding=1&fs=1&cc_load_policy=0&iv_load_policy=3&enablejsapi=1"
                  title="Hoa Hậu Sinh Viên Hòa Bình Việt Nam - Livestream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  className={styles.beautyImage}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '16px',
                    pointerEvents: 'auto'
                  }}
                />
                <div className={styles.goldBorder} />
              </div>
              
              <motion.div 
                className={styles.imageCaption}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Sparkles size={14} />
                <span>Lan tỏa thông điệp Hòa Bình - Nhân Văn - Tự hào Dân tộc</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Purpose
