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
  Crown
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
    if (!formData.phone.trim()) return 'Vui lòng nhập số điện thoại'
    if (!formData.email.trim()) return 'Vui lòng nhập email'
    if (!formData.confirmed) return 'Vui lòng xác nhận tham dự'
    if (event.hasRegion && !formData.region) return 'Vui lòng chọn khu vực'
    
    // Validate phone format
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      return 'Số điện thoại không hợp lệ'
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      return 'Email không hợp lệ'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
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
          round: event.slug
        })
      })

      const result: CheckinResponse = await response.json()

      if (result.success) {
        setIsSuccess(true)
        setConfirmationCode(result.confirmationCode || null)
        onSuccess?.(result)
      } else {
        setError(result.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        className={styles.successCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.successIcon}>
          <CheckCircle size={48} />
        </div>
        <h3 className={styles.successTitle}>
          Đã ghi nhận check-in!
        </h3>
        <p className={styles.successMessage}>
          {event.slug === 'so-khao' && formData.region
            ? `Đã ghi nhận check-in Sơ khảo – Khu vực ${formData.region === 'HN' ? 'Hà Nội' : formData.region === 'DN' ? 'Đà Nẵng' : 'TP.HCM'}.`
            : event.slug === 'chung-ket'
            ? 'Đã ghi nhận check-in Chung kết. Hẹn gặp bạn tại Cung Tiên Sơn – Đà Nẵng.'
            : event.slug === 'ban-ket'
            ? 'Đã ghi nhận check-in Bán kết.'
            : 'Hẹn gặp bạn tại sự kiện!'
          }
        </p>
        
        {confirmationCode && (
          <div className={styles.confirmationCode}>
            <span className={styles.codeLabel}>Mã xác nhận:</span>
            <span className={styles.codeValue}>{confirmationCode}</span>
          </div>
        )}
        
        <div className={styles.successActions}>
          <motion.button
            className={styles.primaryButton}
            onClick={() => window.location.href = '/checkin'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Về trang tổng quan
          </motion.button>
          
          <motion.button
            className={styles.secondaryButton}
            onClick={() => window.open('https://facebook.com/hhsvhbvn', '_blank')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Theo dõi fanpage
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.form
      className={styles.form}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          Xác nhận tham dự {event.name}
        </h2>
        <p className={styles.formSubtitle}>
          {event.slug === 'so-khao' 
            ? 'Chọn khu vực sơ khảo & xác nhận tham dự.'
            : event.slug === 'ban-ket'
            ? 'BTC sẽ xác thực thông tin trước khi xếp chỗ.'
            : event.slug === 'chung-ket'
            ? 'Số lượng có hạn — vui lòng xác nhận sớm.'
            : 'Vui lòng điền thông tin để BTC xác nhận tham dự.'
          }
        </p>
      </div>

      {error && (
        <motion.div
          className={styles.errorAlert}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      <div className={styles.formFields}>
        {/* Họ và tên */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <User size={16} />
            <span>Họ và tên <span className={styles.required}>*</span></span>
          </label>
          <input
            type="text"
            className={styles.fieldInput}
            placeholder="Nguyễn Thị A"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Số điện thoại */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <Phone size={16} />
            <span>Số điện thoại <span className={styles.required}>*</span></span>
          </label>
          <input
            type="tel"
            className={styles.fieldInput}
            placeholder="09xx xxx xxx"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Email */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>
            <Mail size={16} />
            <span>Email <span className={styles.required}>*</span></span>
          </label>
          <input
            type="email"
            className={styles.fieldInput}
            placeholder="email@domain.com"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {/* Khu vực (chỉ cho sơ khảo) */}
        {event.hasRegion && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <MapPin size={16} />
              <span>Khu vực <span className={styles.required}>*</span></span>
            </label>
            <select
              className={styles.fieldSelect}
              value={formData.region || ''}
              onChange={(e) => handleInputChange('region', e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Chọn khu vực</option>
              <option value="HN">Hà Nội</option>
              <option value="DN">Đà Nẵng</option>
              <option value="HCM">TP.HCM</option>
            </select>
          </div>
        )}

        {/* Mã thí sinh (chỉ cho bán kết) */}
        {event.hasContestantId && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>
              <Crown size={16} />
              <span>Mã thí sinh (nếu có)</span>
            </label>
            <input
              type="text"
              className={styles.fieldInput}
              placeholder="Nhập mã thí sinh"
              value={formData.contestantId || ''}
              onChange={(e) => handleInputChange('contestantId', e.target.value)}
              disabled={isSubmitting}
            />
          </div>
        )}

        {/* Checkbox xác nhận */}
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={formData.confirmed}
              onChange={(e) => handleInputChange('confirmed', e.target.checked)}
              disabled={isSubmitting}
            />
            <span className={styles.checkboxText}>
              Tôi xác nhận sẽ tham dự sự kiện
              <span className={styles.required}> *</span>
            </span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
        disabled={isSubmitting}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className={styles.spinner} />
            <span>Đang gửi...</span>
          </>
        ) : (
          <>
            <CheckCircle size={18} />
            <span>Xác nhận tham dự</span>
          </>
        )}
      </motion.button>

      <p className={styles.formFooter}>
        Hoàn tất trong ~30 giây. Thông tin được bảo mật.
      </p>
    </motion.form>
  )
}

export default CheckinForm
