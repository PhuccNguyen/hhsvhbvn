'use client'

import { motion } from 'framer-motion'
import { 
  MousePointer2,
  Edit,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  QrCode,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import styles from './HowItWorks.module.css'

const HowItWorks = () => {
  const checkinEvents = [
    { 
      name: 'Họp báo', 
      path: '/checkin/hop-bao',
      date: '27/09/2025 17h-21h',
      color: '#ef4444'
    },
    { 
      name: 'Sơ Tuyển', 
      path: '/checkin/so-tuyen',
      date: '27/09-25/11/2025',
      color: '#10b981'
    },
    { 
      name: 'Sơ khảo', 
      path: '/checkin/so-khao',
      date: '06/11-30/11/2025',
      color: '#f59e0b'
    },
    { 
      name: 'Bán kết', 
      path: '/checkin/ban-ket',
      date: '05/12-15/12/2025',
      color: '#3b82f6'
    },
    { 
      name: 'Chung kết', 
      path: '/checkin/chung-ket',
      date: '16/12-28/12/2025',
      color: '#8b5cf6'
    }
  ]

  const steps = [
    {
      icon: MousePointer2,
      title: 'Chọn sự kiện',
      description: 'Chọn đúng sự kiện bạn muốn tham dự từ danh sách bên dưới',
      color: '#ef4444'
    },
    {
      icon: Edit,
      title: 'Điền thông tin',
      description: 'Họ tên, số điện thoại, email và xác nhận tham dự',
      color: '#f59e0b'
    },
    {
      icon: Send,
      title: 'Gửi biểu mẫu',
      description: 'Nhấn "Xác nhận tham dự" để hoàn tất đăng ký',
      color: '#10b981'
    }
  ]

  const afterSteps = [
    {
      icon: CheckCircle,
      text: 'Hiện thông báo: "Đã ghi nhận! Hẹn gặp bạn tại sự kiện."'
    },
    {
      icon: Mail,
      text: 'Bạn sẽ nhận email/SMS xác nhận (nếu bật).'
    },
    {
      icon: Clock,
      text: 'Vui lòng đến sớm 15 phút để làm thủ tục.'
    }
  ]

  const quickNotes = [
    {
      icon: QrCode,
      text: 'Nếu vào từ QR, trang sẽ tự nhận sự kiện; bạn chỉ cần kiểm tra thông tin rồi gửi.'
    },
    {
      icon: MousePointer2,
      text: 'Nếu vào trực tiếp link, hãy chọn đúng sự kiện ở trên.'
    },
    {
      icon: AlertCircle,
      text: 'Thông tin chỉ dùng cho đón tiếp & an ninh sự kiện.'
    }
  ]

  return (
    <section className={styles.howItWorksSection}>
      {/* Background */}
      <div className={styles.backgroundContainer}>
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
          <div className={styles.headerIcon}>
            <MousePointer2 size={24} />
          </div>
          <h2 className={styles.sectionTitle}>
            Hướng Dẫn Check-in
          </h2>
          <p className={styles.sectionSubtitle}>
            Chỉ 2 bước đơn giản để xác nhận tham dự sự kiện
          </p>
        </motion.div>

        {/* Event Selection */}
        <motion.div 
          className={styles.eventSelection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className={styles.subsectionTitle}>
            Chọn đúng sự kiện của bạn để vào form:
          </h3>
          
          <div className={styles.eventGrid}>
            {checkinEvents.map((event, index) => (
              <motion.div
                key={event.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={event.path} className={styles.eventCard}>
                  <div 
                    className={styles.eventIndicator}
                    style={{ backgroundColor: event.color }}
                  />
                  <div className={styles.eventContent}>
                    <h4 className={styles.eventName}>{event.name}</h4>
                    <p className={styles.eventDate}>{event.date}</p>
                  </div>
                  <div className={styles.eventArrow}>
                    <MousePointer2 size={18} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Steps */}
        <motion.div 
          className={styles.stepsSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className={styles.subsectionTitle}>2 bước là xong</h3>
          
          <div className={styles.stepsGrid}>
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={index}
                  className={styles.stepCard}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ y: -4 }}
                >
                  <div className={styles.stepNumber}>
                    {index + 1}
                  </div>
                  <div 
                    className={styles.stepIcon}
                    style={{ backgroundColor: step.color + '20', color: step.color }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className={styles.stepContent}>
                    <h4 className={styles.stepTitle}>{step.title}</h4>
                    <p className={styles.stepDescription}>{step.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

{/* Form Fields Info */}
<motion.div 
  className={styles.formInfo}
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: 0.6 }}
>
  <h4 className={styles.formInfoTitle}>Thông tin cần điền:</h4>

  <div className={styles.fieldList}>
    <div className={styles.fieldItem}>
      <span className={styles.fieldLabel}>Họ và tên</span>
      <span className={styles.fieldRequired}>(bắt buộc)</span>
      <span className={styles.fieldPlaceholder}>
        VD:&nbsp;&ldquo;Nguyễn Thị A&rdquo;
      </span>
    </div>

    <div className={styles.fieldItem}>
      <span className={styles.fieldLabel}>Số điện thoại</span>
      <span className={styles.fieldRequired}>(bắt buộc)</span>
      <span className={styles.fieldPlaceholder}>
        VD:&nbsp;&ldquo;09xx xxx xxx&rdquo;
      </span>
    </div>

    <div className={styles.fieldItem}>
      <span className={styles.fieldLabel}>Email</span>
      <span className={styles.fieldRequired}>(bắt buộc)</span>
      <span className={styles.fieldPlaceholder}>
        VD:&nbsp;&ldquo;email@domain.com&rdquo;
      </span>
    </div>

    <div className={styles.fieldItem}>
      <span className={styles.fieldLabel}>Xác nhận tham dự</span>
      <span className={styles.fieldRequired}>(checkbox)</span>
      <span className={styles.fieldPlaceholder}>
        &ldquo;Tôi xác nhận sẽ tham dự sự kiện&rdquo;
      </span>
    </div>
  </div>
</motion.div>

        </motion.div>

        {/* After Submission */}
        <motion.div 
          className={styles.afterSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className={styles.subsectionTitle}>Sau khi gửi</h3>
          
          <div className={styles.afterGrid}>
            {afterSteps.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  className={styles.afterItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <div className={styles.afterIcon}>
                    <Icon size={18} />
                  </div>
                  <p className={styles.afterText}>{item.text}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Notes */}
        <motion.div 
          className={styles.notesSection}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className={styles.subsectionTitle}>Lưu ý nhanh</h3>
          
          <div className={styles.notesList}>
            {quickNotes.map((note, index) => {
              const Icon = note.icon
              return (
                <motion.div
                  key={index}
                  className={styles.noteItem}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className={styles.noteIcon}>
                    <Icon size={16} />
                  </div>
                  <p className={styles.noteText}>{note.text}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div 
          className={styles.supportSection}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className={styles.supportCard}>
            <div className={styles.supportHeader}>
              <Phone size={20} />
              <h3>Cần hỗ trợ?</h3>
            </div>
            <div className={styles.supportContent}>
              <div className={styles.contactRow}>
                <Mail size={16} />
                <span>tpaentertainment2025@gmail.com</span>
              </div>
              <div className={styles.contactRow}>
                <Phone size={16} />
                <span>0902 031 034</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HowItWorks
