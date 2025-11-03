'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Newspaper, ArrowRight, Calendar } from 'lucide-react'
import styles from './News.module.css'

interface NewsArticle {
  id: string
  title: string
  date: string
  source: string
  excerpt: string
  image: string
  link: string
}

const newsArticles: NewsArticle[] = [
  {
    id: 'nguon-luc',
    title: 'Khởi động cuộc thi Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
    date: '27/09/2025',
    source: 'Báo Nguồn Lực',
    excerpt: 'Cuộc thi mang tính giáo dục cao, khuyến khích sinh viên phát triển toàn diện...',
    image: '/images/news/BAOnguonluc.jpg',
    link: 'https://nguonluc.com.vn/khoi-dong-cuoc-thi-hoa-hau-sinh-vien-hoa-binh-viet-nam-2025-a21529.html',
  },
  {
    id: 'quoc-te',
    title: 'Khởi động cuộc thi Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
    date: '27/09/2025',
    source: 'Báo Quốc Tế',
    excerpt: 'Cuộc thi nhằm tìm ra những đại diện trẻ tuổi của Việt Nam với thông điệp hòa bình...',
    image: '/images/news/baoquocte.webp',
    link: 'https://baoquocte.vn/khoi-dong-cuoc-thi-hoa-hau-sinh-vien-hoa-binh-viet-nam-2025-329181.html',
  },
  {
    id: 'can-tho',
    title: 'Khởi động cuộc thi Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
    date: '27/09/2025',
    source: 'Báo Cần Thơ',
    excerpt: 'Sự kiện thu hút sự quan tâm lớn từ giới trẻ sinh viên trên toàn quốc...',
    image: '/images/news/baocantho.jpg',
    link: 'https://cadn.com.vn/khoi-dong-cuoc-thi-hoa-hau-sinh-vien-hoa-binh-viet-nam-2025-post319763.html',
  },
]

const News = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  return (
    <section className={styles.newsSection} aria-labelledby="news-heading">
      {/* Background */}
      <div className={styles.backgroundContainer} aria-hidden="true">
        <div className={styles.bgGradient1} />
        <div className={styles.bgGradient2} />
        <div className={styles.overlay} />
      </div>

      <div className={styles.container}>
        {/* Header */}
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.headerIcon} aria-hidden="true">
            <Newspaper size={24} />
          </div>
          <h2 id="news-heading" className={styles.sectionTitle}>
            Tin Tức & Thông Cáo Báo Chí
          </h2>
          <p className={styles.sectionSubtitle}>
            Cập nhật những thông tin mới nhất về cuộc thi từ các báo chí uy tín
          </p>
        </motion.div>

        {/* News Grid */}
        <motion.div
          className={styles.newsGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {newsArticles.map((article) => (
            <motion.article
              key={article.id}
              className={styles.newsCard}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
              >
                {/* Image */}
                <div className={styles.imageWrapper}>
                  <Image
                    src={article.image}
                    alt={`${article.title} - ${article.source}`}
                    fill
                    className={styles.newsImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className={styles.imageOverlay} />
                  <div className={styles.sourceBadge}>
                    <Newspaper size={14} />
                    <span>{article.source}</span>
                  </div>
                </div>

                {/* Content */}
                <div className={styles.cardContent}>
                  <div className={styles.dateWrapper}>
                    <Calendar size={14} />
                    <time dateTime={article.date} className={styles.date}>
                      {article.date}
                    </time>
                  </div>

                  <h3 className={styles.articleTitle}>{article.title}</h3>

                  <p className={styles.excerpt}>{article.excerpt}</p>

                  <div className={styles.readMore}>
                    <span>Đọc thêm</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div
          className={styles.viewAllWrapper}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/news" className={styles.viewAllButton}>
            <span>Xem tất cả tin tức</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default News
