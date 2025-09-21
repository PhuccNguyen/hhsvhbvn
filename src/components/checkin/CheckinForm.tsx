'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Phone, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  MapPin,
  Crown,
  Heart,
  Shield,
  Clock
} from 'lucide-react'
import { EventInfo, CheckinResponse } from '@/lib/types'
import styles from './CheckinForm.module.css'

interface CheckinFormProps {
  event: EventInfo
  onSuccess?: (response: CheckinResponse) => void
}

interface FormData {
  fullName: string
  phone: string
  email: string
  confirmed: boolean
  region?: string
  contestantId?: string
}

const CheckinForm = ({ event, onSuccess }: CheckinFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    confirmed: false,
    region: event.hasRegion ? '' : undefined,
    contestantId: event.hasContestantId ? '' : undefined
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null)

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const validateForm = (): string | null => {
    if (!formData.fullName.trim()) return 'Vui lòng nhập họ tên'
    if (formData.fullName.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự'
    if (!formData.phone.trim()) return 'Vui lòng nhập số điện thoại'
    if (!formData.email.trim()) return 'Vui lòng nhập email'
    if (!formData.confirmed) return 'Vui lòng xác nhận tham dự'
    if (event.hasRegion && !formData.region) return 'Vui lòng chọn khu vực'
    
    // Validate phone format
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      return 'Số điện thoại không hợp lệ (VD: 0901234567)'
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return 'Địa chỉ email không hợp lệ'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      // Smooth scroll to error
      const errorElement = document.querySelector(`.${styles.errorAlert}`)
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          round: event.slug,
          timestamp: new Date().toISOString()
        })
      })

      const result: CheckinResponse = await response.json()

      if (result.success) {
        setIsSuccess(true)
        setConfirmationCode(result.confirmationCode || null)
        onSuccess?.(result)
        
        // Scroll to success card
        setTimeout(() => {
          const successElement = document.querySelector(`.${styles.successCard}`)
          successElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      } else {
        setError(result.message || 'Có lỗi xảy ra, vui lòng thử lại')
      }
    } catch (error) {
      setError('Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        className={styles.successCard}
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
      >
        <motion.div 
          className={styles.successIcon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
        >
          <CheckCircle size={48} />
        </motion.div>
        
        <motion.h3 
          className={styles.successTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Check-in thành công! 🎉
        </motion.h3>
        
        <motion.p 
          className={styles.successMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {event.slug === 'so-khao' && formData.region
            ? `Đã ghi nhận check-in Sơ khảo – Khu vực ${formData.region === 'HN' ? 'Hà Nội' : formData.region === 'DN' ? 'Đà Nẵng' : 'TP.HCM'}. Chúng tôi sẽ liên hệ thông báo lịch thi cụ thể.`
            : event.slug === 'chung-ket'
            ? 'Đã ghi nhận check-in Chung kết. Hẹn gặp bạn tại Cung Tiên Sơn – Đà Nẵng vào ngày 28/12/2025!'
            : event.slug === 'ban-ket'
            ? 'Đã ghi nhận check-in Bán kết. BTC sẽ liên hệ xác nhận thông tin và hướng dẫn chi tiết.'
            : 'Cảm ơn bạn đã đăng ký tham dự. BTC sẽ liên hệ sớm nhất có thể!'
          }
        </motion.p>
        
        {confirmationCode && (
          <motion.div 
            className={styles.confirmationCode}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className={styles.codeLabel}>Mã xác nhận:</span>
            <span className={styles.codeValue}>{confirmationCode}</span>
          </motion.div>
        )}
        
        <motion.div 
          className={styles.successActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className={styles.primaryButton}
            onClick={() => window.location.href = '/'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Crown size={18} />
            Về trang chủ
          </motion.button>
          
          <motion.button
            className={styles.secondaryButton}
            onClick={() => window.open('https://tingvote.com', '_blank')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Heart size={18} />
            Vote ngay
          </motion.button>
        </motion.div>

        <motion.div 
          className={styles.successFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Heart size={14} className={styles.heartIcon} />
          <span>Cảm ơn bạn đã tham gia HHSV Hòa Bình Việt Nam 2025</span>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.formHeader}>
        <motion.h2 
          className={styles.formTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Xác nhận tham dự {event.name}
        </motion.h2>
        <motion.p 
          className={styles.formSubtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {event.slug === 'so-khao' 
            ? 'Chọn khu vực sơ khảo & xác nhận tham dự. BTC sẽ thông báo lịch thi cụ thể.'
            : event.slug === 'ban-ket'
            ? 'BTC sẽ xác thực thông tin và thông báo kết quả trước khi sắp xếp chỗ ngồi.'
            : event.slug === 'chung-ket'
            ? 'Số lượng ghế có hạn — vui lòng xác nhận tham dự sớm nhất có thể.'
            : 'Vui lòng điền đầy đủ thông tin để BTC có thể xác nhận và liên hệ với bạn.'
          }
        </motion.p>
      </div>

      {error && (
        <motion.div
          className={styles.errorAlert}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className={styles.formFields}>
        {/* Họ và tên */}
        <motion.div 
          className={styles.fieldGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className={styles.fieldLabel}>
            <User size={16} />
            <span>Họ và tên <span className={styles.required}>*</span></span>
          </label>
          <input
            type="text"
            className={styles.fieldInput}
            placeholder="Nhập họ và tên đầy đủ"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            disabled={isSubmitting}
            autoComplete="name"
          />
        </motion.div>

        {/* Số điện thoại */}
        <motion.div 
          className={styles.fieldGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className={styles.fieldLabel}>
            <Phone size={16} />
            <span>Số điện thoại <span className={styles.required}>*</span></span>
          </label>
          <input
            type="tel"
            className={styles.fieldInput}
            placeholder="0901234567"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={isSubmitting}
            autoComplete="tel"
          />
        </motion.div>

        {/* Email */}
        <motion.div 
          className={styles.fieldGroup}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className={styles.fieldLabel}>
            <Mail size={16} />
            <span>Email <span className={styles.required}>*</span></span>
          </label>
          <input
            type="email"
            className={styles.fieldInput}
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={isSubmitting}
            autoComplete="email"
          />
        </motion.div>

        {/* Khu vực (chỉ cho sơ khảo) */}
        {event.hasRegion && (
          <motion.div 
            className={styles.fieldGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label className={styles.fieldLabel}>
              <MapPin size={16} />
              <span>Khu vực thi <span className={styles.required}>*</span></span>
            </label>
            <select
              className={styles.fieldSelect}
              value={formData.region || ''}
              onChange={(e) => handleInputChange('region', e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">-- Chọn khu vực --</option>
              <option value="HN">Hà Nội (09/11/2025)</option>
              <option value="DN">Đà Nẵng (16/11/2025)</option>
              <option value="HCM">TP.HCM (23/11/2025)</option>
            </select>
          </motion.div>
        )}

        {/* Mã thí sinh (chỉ cho bán kết) */}
        {event.hasContestantId && (
          <motion.div 
            className={styles.fieldGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label className={styles.fieldLabel}>
              <Crown size={16} />
              <span>Mã thí sinh (nếu có)</span>
            </label>
            <input
              type="text"
              className={styles.fieldInput}
              placeholder="Nhập mã thí sinh được cấp"
              value={formData.contestantId || ''}
              onChange={(e) => handleInputChange('contestantId', e.target.value)}
              disabled={isSubmitting}
            />
          </motion.div>
        )}

        {/* Checkbox xác nhận */}
        <motion.div 
          className={styles.checkboxGroup}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.confirmed}
              onChange={(e) => handleInputChange('confirmed', e.target.checked)}
              disabled={isSubmitting}
            />
            <span className={styles.checkboxText}>
              Tôi xác nhận sẽ tham dự sự kiện đúng thời gian
              <span className={styles.required}> *</span>
            </span>
          </label>
        </motion.div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className={styles.spinner} />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            <CheckCircle size={18} />
            <span>Xác nhận tham dự</span>
          </>
        )}
      </motion.button>

      {/* Form Footer */}
      <motion.div 
        className={styles.formFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <div className={styles.footerContent}>
          <Shield size={14} />
          <span>Thông tin được bảo mật và chỉ dùng cho sự kiện</span>
        </div>
        <div className={styles.footerTime}>
          <Clock size={14} />
          <span>Hoàn tất trong ~30 giây</span>
        </div>
        <div className={styles.footerLove}>
          <Heart size={14} className={styles.heartIcon} />
          <span>Được tạo với ❤️ bởi TingNect</span>
        </div>
      </motion.div>
    </motion.form>
  )
}

export default CheckinForm
