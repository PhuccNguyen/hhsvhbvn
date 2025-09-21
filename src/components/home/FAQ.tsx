'use client'

import { useMemo, useState } from 'react'
import Script from 'next/script'
import { LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  Users,
  Target,
  FileText,
  Calendar,
  Award,
  Phone,
  Star,
  Heart,
  Trophy,
  Mail,
} from 'lucide-react'
import styles from './FAQ.module.css'

interface FAQItem {
  id: string
  question: string
  answer: string
  icon: LucideIcon
  category: 'general' | 'requirements' | 'process' | 'rewards'
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hhsvhbvn.tingnect.com'

/** ====== DATA ====== */
const faqData: FAQItem[] = [
  {
    id: 'who-can-join',
    question: 'Cuộc thi này dành cho ai?',
    answer:
      'Dành cho nữ sinh viên Việt Nam (trong nước & Việt kiều), độ tuổi 19–25, đang theo học ĐH/CĐ/HV.',
    icon: Users,
    category: 'general',
  },
  {
    id: 'meaning',
    question: 'Mục tiêu và ý nghĩa của cuộc thi là gì?',
    answer:
      'Tôn vinh vẻ đẹp sinh viên gắn với trí tuệ – bản lĩnh – nhân ái – tinh thần yêu nước, lan tỏa văn hóa Việt và tạo sân chơi quốc gia cho kết nối – học hỏi – định hướng tương lai.',
    icon: Target,
    category: 'general',
  },
  {
    id: 'requirements',
    question: 'Thể lệ nổi bật cần lưu ý?',
    answer:
      'Chưa lập gia đình, không phẫu thuật thẩm mỹ, chiều cao từ 1m63; có CCCD/Passport còn hiệu lực; tuân thủ quy định truyền thông hình ảnh của BTC.',
    icon: FileText,
    category: 'requirements',
  },
  {
    id: 'special-entry',
    question: 'Có diện đặc cách không?',
    answer:
      'Có. Thí sinh có thành tích sắc đẹp (2021–2024) theo tiêu chí BTC có thể đặc cách vào Chung khảo (vẫn phải đáp ứng điều kiện dự thi & hồ sơ).',
    icon: Star,
    category: 'requirements',
  },
  {
    id: 'documents',
    question: 'Hồ sơ cần những gì?',
    answer:
      'Đơn đăng ký; thẻ SV; CCCD/Passport; ảnh mới ≤ 3 tháng (chân dung/bán thân/toàn thân, áo dài/dân tộc/dạ hội/thể thao); clip dọc tự giới thiệu; giấy xác nhận độc thân; giấy tờ ưu tiên (nếu có).',
    icon: FileText,
    category: 'requirements',
  },
  {
    id: 'timeline',
    question: 'Thời gian nộp hồ sơ?',
    answer: '20/08/2025 – 25/11/2025. Hồ sơ online qua website/fanpage chính thức.',
    icon: Calendar,
    category: 'process',
  },
  {
    id: 'important-dates',
    question: 'Các mốc quan trọng?',
    answer:
      'Tuyển sinh (đang mở) → Sơ khảo 11/2025 → Bán kết 05–15/12/2025 → Chung kết 28/12/2025 (Cung Tiên Sơn, Đà Nẵng).',
    icon: Calendar,
    category: 'process',
  },
  {
    id: 'voting',
    question: 'Bình chọn hoạt động thế nào?',
    answer:
      'Hồ sơ hợp lệ được đăng tải trên kênh chính thức; khán giả bình chọn tại Tingnect.com. Kết quả bình chọn minh bạch và là một phần trong cơ chế chấm điểm.',
    icon: Heart,
    category: 'process',
  },
  {
    id: 'media',
    question: 'Truyền hình & truyền thông có gì đặc sắc?',
    answer:
      'Hành trình truyền hình thực tế (VTV, YouTube, fanpage), sân khấu hiện đại, biểu tượng Sen & Bồ câu; lan tỏa mạnh mẽ đến cộng đồng sinh viên cả nước.',
    icon: Star,
    category: 'process',
  },
  {
    id: 'prizes',
    question: 'Giải thưởng ra sao?',
    answer:
      'Tổng giải thưởng lên tới 2 tỷ đồng (tiền mặt, vương miện, gói truyền thông, học bổng/visa…); nhiều danh hiệu đại sứ và giải phụ hấp dẫn.',
    icon: Trophy,
    category: 'rewards',
  },
]

const categories = [
  { id: 'general', label: 'Tổng quan', icon: Target },
  { id: 'requirements', label: 'Yêu cầu', icon: FileText },
  { id: 'process', label: 'Quy trình', icon: Calendar },
  { id: 'rewards', label: 'Giải thưởng', icon: Award },
] as const

const FAQ = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]['id']>('general')

  const filteredFAQ = useMemo(
    () => faqData.filter((item) => item.category === activeCategory),
    [activeCategory]
  )

  const toggleItem = (id: string) => {
    setActiveItem((cur) => (cur === id ? null : id))
  }

  // Chuẩn bị dữ liệu JSON-LD FAQPage (khớp các Q/A đang hiển thị)
  const faqJsonLd = useMemo(() => {
    const mainEntity = filteredFAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    }))
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity,
    }
  }, [filteredFAQ])

  return (
    <section className={styles.faqSection} aria-labelledby="faq-heading">
      {/* JSON-LD cho phần FAQ đang được lọc theo tab (Google vẫn chấp nhận dạng con) */}
      <Script
        id={`ld-faq-${activeCategory}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Background */}
      <div className={styles.backgroundContainer} aria-hidden="true">
        <div className={styles.bgImage1} />
        <div className={styles.bgImage2} />
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
            <Star size={24} />
          </div>
          <h2 id="faq-heading" className={styles.sectionTitle}>
            Câu Hỏi Thường Gặp
          </h2>
          <p className={styles.sectionSubtitle}>
            Những thông tin cần thiết để bạn hiểu rõ hơn về cuộc thi
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className={styles.categoryTabs}
          role="tablist"
          aria-label="Danh mục câu hỏi"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeCategory === category.id
            return (
              <motion.button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`faq-panel-${category.id}`}
                id={`faq-tab-${category.id}`}
                className={`${styles.categoryTab} ${isActive ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={16} />
                <span>{category.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {/* FAQ Items */}
        <div
          className={styles.faqGrid}
          role="tabpanel"
          id={`faq-panel-${activeCategory}`}
          aria-labelledby={`faq-tab-${activeCategory}`}
        >
          <AnimatePresence mode="wait">
            {filteredFAQ.map((item, index) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              const contentId = `faq-content-${item.id}`
              const buttonId = `faq-button-${item.id}`

              return (
                <motion.div
                  key={item.id}
                  className={`${styles.faqItem} ${isActive ? styles.active : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  whileHover={{ y: -2 }}
                >
                  <button
                    id={buttonId}
                    type="button"
                    className={styles.faqTrigger}
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isActive}
                    aria-controls={contentId}
                  >
                    <div className={styles.questionContent}>
                      <div className={styles.questionIcon} aria-hidden="true">
                        <Icon size={18} />
                      </div>
                      <span className={styles.questionText}>{item.question}</span>
                    </div>
                    <motion.span
                      className={styles.chevron}
                      aria-hidden="true"
                      animate={{ rotate: isActive ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        id={contentId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={styles.faqAnswer}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className={styles.answerContent}>
                          <p>{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Contact Section */}
        <motion.div
          className={styles.contactSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.contactCard}>
            <div className={styles.contactHeader}>
              <Phone size={20} />
              <h3>Nhận hỗ trợ</h3>
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <a
                  href="mailto:tpaentertainment2025@gmail.com"
                  className={styles.link}
                >
                  tpaentertainment2025@gmail.com
                </a>
              </div>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <a href="tel:+84902031034" className={styles.link}>
                  0902&nbsp;031&nbsp;034
                </a>
              </div>
            </div>
            <p className={styles.contactNote}>
              TPA Entertainment – 29 đường 12, P. Gò Vấp, TP.HCM
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FAQ
