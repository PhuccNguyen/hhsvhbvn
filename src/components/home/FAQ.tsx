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

/** ====== DATA ====== */
const faqData: FAQItem[] = [
  {
    id: 'who-can-join',
    question: 'Cuộc thi này dành cho ai?',
    answer:
      'Dành cho nữ sinh viên Việt Nam (bao gồm cả Việt kiều - có Cha hoặc Mẹ là người Việt Nam), độ tuổi từ 18-25 tuổi, đang theo học tại các trường Đại Học, Cao Đẳng và Học Viện.',
    icon: Users,
    category: 'general',
  },
  {
    id: 'meaning',
    question: 'Mục đích và ý nghĩa của cuộc thi?',
    answer:
      'Cuộc thi quy mô quốc gia đầu tiên tôn vinh vẻ đẹp "Xinh đẹp – Trí tuệ – Bản lĩnh – Nhân ái - Hòa Bình", tạo sân chơi cho nữ sinh viên kết nối - giao lưu - học hỏi, đồng thời lan tỏa lòng nhân ái, yêu nước và quảng bá văn hóa - di sản Việt Nam.',
    icon: Target,
    category: 'general',
  },
  {
    id: 'requirements',
    question: 'Các tiêu chí tham gia bắt buộc?',
    answer:
      'Chưa lập gia đình, chưa sinh con; không phẫu thuật thẩm mỹ; chiều cao từ 1m63 trở lên; có CCCD/Passport còn hiệu lực; không có tiền án; có giấy xác nhận độc thân từ chính quyền địa phương.',
    icon: FileText,
    category: 'requirements',
  },
  {
    id: 'special-entry',
    question: 'Có diện đặc cách vào Bán kết không?',
    answer:
      'Có. Thí sinh đã vào Chung kết các cuộc thi sắc đẹp quy mô toàn quốc, vùng miền, tỉnh thành; Hoa khôi, Á khôi các cuộc thi cấp tỉnh/trường ĐH/CĐ từ năm 2021-2024 được đặc cách vào Bán kết (vẫn phải đáp ứng đầy đủ điều kiện và hồ sơ).',
    icon: Star,
    category: 'requirements',
  },
  {
    id: 'documents',
    question: 'Hồ sơ dự thi cần những gì?',
    answer:
      'Đơn đăng ký + Sơ yếu lý lịch (theo mẫu BTC); bản sao công chứng thẻ SV + CCCD/Passport; 02 ảnh 3x4 + 03 ảnh 10x15cm (áo dài, váy dạ hội, trang phục dân tộc, áo tắm - chụp trong 3 tháng); video clip giới thiệu bản thân 1-3 phút (dọc, HD 1920x1080); giấy chứng nhận danh hiệu (nếu đặc cách).',
    icon: FileText,
    category: 'requirements',
  },
  {
    id: 'timeline',
    question: 'Thời gian nộp hồ sơ và các vòng thi?',
    answer:
      'Sơ tuyển: 27/09-25/11/2025 (online qua website/email hoặc offline tại VP BTC). Sơ khảo: 06/11-30/11 tại 4 khu vực (Cần Thơ, TP.HCM, Hà Nội, Đà Nẵng). Bán kết: 05-15/12 tại Đà Nẵng. Chung kết: 28/12/2025 tại Cung Tiên Sơn, Đà Nẵng.',
    icon: Calendar,
    category: 'process',
  },
  {
    id: 'registration-methods',
    question: 'Làm sao để đăng ký dự thi?',
    answer:
      'Online: Nộp qua website hoahausinhvienhoabinh.com/dang-ky hoặc email tuyensinh.hhsvhbvn@gmail.com. Offline: Nộp trực tiếp tại Văn phòng Công ty Cổ Phần Thương Mại Gia Phạm. Hạn cuối: 25/11/2025.',
    icon: Users,
    category: 'process',
  },
  {
    id: 'voting',
    question: 'Bình chọn hoạt động thế nào?',
    answer:
      'Hồ sơ hợp lệ được đăng tải trên kênh chính thức. Khán giả bình chọn qua Tingnect.com. Giải "Người đẹp được khán giả yêu thích nhất" trị giá 50 triệu VNĐ + cơ hội du học quốc tế + khóa học hàng không chuyên nghiệp.',
    icon: Heart,
    category: 'process',
  },
  {
    id: 'preliminary-rounds',
    question: 'Vòng Sơ khảo diễn ra như thế nào?',
    answer:
      'Tổ chức tại 4 khu vực: Cần Thơ (06/11), TP.HCM (14/11), Hà Nội (17-23/11), Đà Nẵng (24-30/11). Thí sinh trình diễn catwalk theo nhạc và trả lời câu hỏi phản ứng nhanh để thể hiện phong thái, sự tự tin và khả năng ứng biến.',
    icon: Calendar,
    category: 'process',
  },
  {
    id: 'prizes',
    question: 'Giải thưởng của cuộc thi?',
    answer:
      'TỔNG: 2 tỷ VNĐ. Hoa hậu: 2 tỷ + học bổng Mỹ 100k USD. Á hậu 1: 1 tỷ + visa 50k USD. Á hậu 2: 500 triệu. Á hậu 3: 250 triệu. Các giải phụ: 50 triệu/giải (Thân thiện, Trang phục truyền thống, Khán giả yêu thích, Ảnh, Phong cách, Đại sứ Hòa Bình, Đại sứ Khởi nghiệp, Đại sứ Tài năng, Đại sứ Nhân ái).',
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
