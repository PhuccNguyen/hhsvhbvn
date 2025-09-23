'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle,
  Clock,
  Copy,
  Crown,
  ExternalLink,
  Heart,
  Home,
  Info,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Shield,
  User,
} from 'lucide-react'
import styles from './CheckinForm.module.css'
import { 
  validateFullName, 
  validatePhoneNumber, 
  validateEmail, 
  getUserData, 
  getCheckinStatus, 
  saveUserData, 
  saveCheckinStatus,
} from '@/lib/utils'
import { getEventStatus } from '@/lib/eventUtils'
import type { EventInfo, EventStatus, FormFieldError, CheckinResponse } from '@/lib/types'

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

interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  fieldErrors: FormFieldError[]
  globalError: string | null
  confirmationCode: string | null
  eventStatus: EventStatus | null
  hasCheckedIn: boolean
  isCodeCopied: boolean
}

const CheckinForm = ({ event, onSuccess }: CheckinFormProps) => {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    confirmed: false,
    region: event.hasRegion ? '' : undefined,
    contestantId: event.hasContestantId ? '' : undefined
  })

  // Form state management
  const [state, setState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    fieldErrors: [],
    globalError: null,
    confirmationCode: null,
    eventStatus: null,
    hasCheckedIn: false,
    isCodeCopied: false
  })

  // Refs for focus management
  const formRef = useRef<HTMLFormElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const [tipOpen, setTipOpen] = useState(false)

  // Initialize form with saved data and check event status
  useEffect(() => {
    console.log('useEffect triggered with event:', event) // Debug
    // Load saved user data
    const savedData = getUserData()
    if (savedData) {
      setFormData(prev => ({
        ...prev,
        fullName: savedData.fullName || prev.fullName,
        email: savedData.email || prev.email,
        phone: savedData.phone || prev.phone
      }))
    }

    // Check if already checked in
    const checkinStatus = getCheckinStatus(event.slug)
    console.log('Checkin status:', checkinStatus) // Debug
    if (checkinStatus) {
      setState(prev => ({
        ...prev,
        hasCheckedIn: true,
        isSuccess: true,
        confirmationCode: checkinStatus.confirmationCode
      }))
    }

    // Check event status
    const eventStatus = getEventStatus(event)
    setState(prev => ({ ...prev, eventStatus }))

    // Focus first field
    setTimeout(() => {
      if (!checkinStatus && firstFieldRef.current) {
        firstFieldRef.current.focus()
      }
    }, 300)
  }, [event])

  // Real-time field validation
  const validateField = (field: keyof FormData, value: string | boolean | undefined): string | null => {
    switch (field) {
      case 'fullName':
        if (typeof value === 'string') {
          if (!value.trim()) return 'Họ tên là bắt buộc'
          if (value.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự'
          if (value.trim().length > 100) return 'Họ tên không được quá 100 ký tự'
          if (!validateFullName(value)) return 'Họ tên chỉ được chứa chữ cái và khoảng trắng'
        }
        break
      
      case 'phone':
        if (typeof value === 'string') {
          if (!value.trim()) return 'Số điện thoại là bắt buộc'
          if (!validatePhoneNumber(value)) return 'Số điện thoại không đúng định dạng (VD: 0901234567)'
        }
        break
      
      case 'email':
        if (typeof value === 'string') {
          if (!value.trim()) return 'Email là bắt buộc'
          if (!validateEmail(value)) return 'Địa chỉ email không hợp lệ'
        }
        break
      
      case 'region':
        if (event.hasRegion && (typeof value !== 'string' || !value)) return 'Vui lòng chọn khu vực thi'
        break
      
      case 'confirmed':
        if (value !== true) return 'Bạn phải xác nhận tham dự để tiếp tục'
        break
      
      default:
        break
    }
    return null
  }

  // Handle input changes with real-time validation
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setState(prev => ({
      ...prev,
      fieldErrors: prev.fieldErrors.filter(error => error.field !== field),
      globalError: null
    }))

    if (typeof value === 'string' && value.trim()) {
      const fieldError = validateField(field, value)
      if (fieldError) {
        setState(prev => ({
          ...prev,
          fieldErrors: [...prev.fieldErrors.filter(e => e.field !== field), {
            field,
            message: fieldError,
            type: 'validation'
          }]
        }))
      }
    }
  }

  // Comprehensive form validation
  const validateForm = (): FormFieldError[] => {
    const errors: FormFieldError[] = []
    Object.keys(formData).forEach(key => {
      const field = key as keyof FormData
      const value = formData[field]
      const error = validateField(field, value)
      if (error) {
        errors.push({
          field,
          message: error,
          type: 'validation'
        })
      }
    })
    return errors
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setState(prev => ({
        ...prev,
        fieldErrors: validationErrors,
        globalError: 'Vui lòng kiểm tra và sửa các lỗi bên dưới'
      }))
      setTimeout(() => {
        const firstErrorField = document.querySelector(`[data-field="${validationErrors[0].field}"]`) as HTMLInputElement
        if (firstErrorField) {
          firstErrorField.focus()
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

    if (!state.eventStatus?.canRegister) {
      setState(prev => ({
        ...prev,
        globalError: state.eventStatus?.message || 'Sự kiện không mở đăng ký'
      }))
      return
    }

    setState(prev => ({ ...prev, isSubmitting: true, globalError: null, fieldErrors: [] }))

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
      console.log('API response:', result) // Debug API response

      if (result.success) {
        saveUserData({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        })

        if (result.confirmationCode) {
          saveCheckinStatus(event.slug, formData.email, result.confirmationCode)
        }

        setState(prev => ({
          ...prev,
          isSuccess: true,
          confirmationCode: result.confirmationCode || null,
          isSubmitting: false,
          hasCheckedIn: true,
          fieldErrors: [],
          globalError: null
        }))

        requestAnimationFrame(() => {
          onSuccess?.(result)
          const successElement = document.querySelector(`.${styles.successCard}`)
          if (successElement) {
            successElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      } else {
        if (response.status === 409 && result.duplicateFields) {
          const duplicateErrors: FormFieldError[] = []
          Object.entries(result.duplicateFields).forEach(([field, isDuplicate]) => {
            if (isDuplicate && field !== 'message') {
              let message = ''
              switch (field) {
                case 'email':
                  message = 'Email đã được sử dụng. Vui lòng dùng email khác hoặc liên hệ BTC.'
                  break
                case 'phone':
                  message = 'Số điện thoại đã được sử dụng. Vui lòng dùng số khác hoặc liên hệ BTC.'
                  break
                case 'contestantId':
                  message = 'Mã thí sinh đã được sử dụng. Vui lòng kiểm tra lại.'
                  break
                default:
                  message = 'Thông tin này đã được sử dụng.'
              }
              duplicateErrors.push({
                field,
                message,
                type: 'duplicate'
              })
            }
          })

          setState(prev => ({
            ...prev,
            fieldErrors: duplicateErrors,
            globalError: 'Một số thông tin đã được sử dụng trước đó',
            isSubmitting: false
          }))
        } else {
          setState(prev => ({
            ...prev,
            globalError: result.message || 'Có lỗi xảy ra, vui lòng thử lại',
            isSubmitting: false
          }))
        }
      }
    } catch (error) {
      console.error('Submission error:', error)
      setState(prev => ({
        ...prev,
        globalError: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.',
        isSubmitting: false
      }))
    }
  }

  // Handle retry
  const handleRetry = () => {
    console.log('handleRetry called') // Debug
    localStorage.removeItem(`checkin_${event.slug}`) // Clear check-in status
    setState(prev => ({
      ...prev,
      isSuccess: false,
      hasCheckedIn: false,
      globalError: null,
      fieldErrors: [],
      confirmationCode: null
    }))
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      confirmed: false,
      region: event.hasRegion ? '' : undefined,
      contestantId: event.hasContestantId ? '' : undefined
    })
    onSuccess?.({ success: false, message: 'User requested retry' })
  }

  // Copy confirmation code
  const handleCopyCode = async () => {
    if (state.confirmationCode) {
      try {
        await navigator.clipboard.writeText(state.confirmationCode)
        setState(prev => ({ ...prev, isCodeCopied: true }))
        setTimeout(() => {
          setState(prev => ({ ...prev, isCodeCopied: false }))
        }, 2000)
      } catch (err) {
        console.error('Failed to copy code:', err)
      }
    }
  }

  // Get field error
  const getFieldError = (field: string): string | null => {
    const error = state.fieldErrors.find(e => e.field === field)
    return error?.message || null
  }

  // Check if field has error
  const hasFieldError = (field: string): boolean => {
    return state.fieldErrors.some(e => e.field === field)
  }

  // Event status check
  if (state.eventStatus && !state.eventStatus.canRegister && !state.isSuccess) {
    return (
      <motion.div
        className={styles.statusCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.statusIcon}>
          <AlertCircle size={48} />
        </div>
        <h3 className={styles.statusTitle}>
          {state.eventStatus.status === 'closed' ? 'Đã đóng đăng ký' : 'Chưa mở đăng ký'}
        </h3>
        <p className={styles.statusMessage}>
          {state.eventStatus.message}
        </p>
        <motion.button
          className={styles.secondaryButton}
          onClick={() => window.location.href = '/'}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Home size={18} />
          Về trang chủ
        </motion.button>
      </motion.div>
    )
  }

  // Success state
  if (state.isSuccess) {
    const toggleTip = () => setTipOpen(v => !v)

    return (
      <motion.div
        className={styles.successCard}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", damping: 25 }}
      >
        {/* Celebratory elements */}
        <div className={styles.celebrationElements}>
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className={styles.confetti}
              initial={{ 
                opacity: 0, 
                y: -20, 
                rotate: 0,
                scale: 0 
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: [0, -30, 60],
                rotate: [0, 180, 360],
                scale: [0, 1, 0.5]
              }}
              transition={{
                duration: 2,
                delay: 0.3 + i * 0.1,
                ease: "easeOut"
              }}
              style={{
                left: `${20 + i * 12}%`,
                backgroundColor: i % 3 === 0 ? '#E7C873' : i % 3 === 1 ? '#2AF4FF' : '#8B5CF6'
              }}
            />
          ))}
        </div>

        {/* Success icon */}
        <motion.div 
          className={styles.successIcon}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
        >
          <CheckCircle size={56} />
        </motion.div>
        
        {/* Title and message */}
        <motion.h3 
          className={styles.successTitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Gửi thành công! 🎉
        </motion.h3>
        
        <motion.p 
          className={styles.successMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          role="status"
          aria-live="polite"
        >
          BTC đã nhận thông tin của bạn và sẽ liên hệ qua{' '}
          <strong>{formData.email}</strong> hoặc{' '}
          <strong>{formData.phone}</strong> trong vòng 24 giờ tới.
        </motion.p>

        {/* Important note */}
        <motion.div 
          className={styles.importantNote}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AlertCircle size={16} />
          <div className={styles.noteContent}>
            <span className={styles.noteTitle}>Lưu ý quan trọng</span>
            <p className={styles.noteText}>
              Để đăng ký lại hoặc chỉnh sửa thông tin, vui lòng nhấn nút &ldquo;Đăng ký lại&rdquo; hoặc tải lại trang.
            </p>
          </div>
        </motion.div>

        {/* Information summary */}
        <motion.div 
          className={styles.summaryCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className={styles.summaryHeader}>
            <Shield size={16} />
            <span>Thông tin đã gửi</span>
          </div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Sự kiện:</span>
              <span className={styles.summaryValue}>{event.name}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Họ tên:</span>
              <span className={styles.summaryValue}>{formData.fullName}</span>
            </div>
            {formData.region && (
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Khu vực:</span>
                <span className={styles.summaryValue}>
                  {formData.region === 'HN' ? 'Hà Nội' : 
                   formData.region === 'DN' ? 'Đà Nẵng' : 'TP.HCM'}
                </span>
              </div>
            )}
          </div>
        </motion.div>
        
        {state.confirmationCode && (
          <motion.div 
            className={styles.confirmationCode}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className={styles.codeHeader}>
              <span className={styles.codeLabel}>
                Mã tham chiếu
                <span className={styles.infoWrap}>
                  <button
                    type="button"
                    className={styles.infoBtn}
                    onClick={toggleTip}
                    aria-expanded={tipOpen}
                    aria-controls="tip-refcode"
                  >
                    <Info size={18} />
                  </button>
                  <AnimatePresence>
                    {tipOpen && (
                      <motion.span
                        id="ref-code-tip"
                        role="tooltip"
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className={styles.tooltipBubble}
                      >
                        Dùng mã này để tra cứu &amp; xác nhận với BTC và đối chiếu khi check-in.
                        <i className={styles.tooltipArrow} aria-hidden="true" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
              <motion.button
                className={styles.copyButton}
                onClick={handleCopyCode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Copy"
                title={state.isCodeCopied ? "Copy" : "Copied"}
              >
                {state.isCodeCopied ? (
                  <>
                    <Check size={14} />
                    <span className={styles.copyStatus}>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span className={styles.copyStatus}>Copy</span>
                  </>
                )}
              </motion.button>
            </div>
            <div className={styles.codeValue}>
              <span className={styles.codePrefix}>{state.confirmationCode.split('-')[0]}</span>
              <span className={styles.codeSeparator}>-</span>
              <span className={styles.codeNumbers}>{state.confirmationCode.split('-')[1]}</span>
            </div>
            <div className={styles.codeNote}>
              Vui lòng lưu lại mã tham chiếu này để sử dụng khi cần
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div 
          className={styles.successActions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className={styles.primaryButton}
            onClick={() => window.location.href = '/'}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Home size={18} />
            Về trang tổng quan
          </motion.button>
          
          <motion.button
            className={styles.secondaryButton}
            onClick={() => window.open('/checkin', '_blank')}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <ExternalLink size={18} />
            Xem sự kiện khác
          </motion.button>
          
          <motion.button
            className={styles.secondaryButton}
            onClick={handleRetry}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw size={16} />
            Đăng ký lại
          </motion.button>
        </motion.div>

        <motion.div 
          className={styles.successFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <Heart size={12} className={styles.heartIcon} />
          <span>Cảm ơn bạn đã tham gia HHSV Hòa Bình Việt Nam 2025</span>
        </motion.div>
      </motion.div>
    )
  }

  // Main form render
  return (
    <div className={styles.formContainer}>
      <motion.form
        ref={formRef}
        className={styles.form}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        noValidate
      >
        {/* Form Header */}
        <div className={styles.formHeader}>
          <motion.h2 
            className={styles.formTitle}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Xác nhận tham dự {event.name}
          </motion.h2>
          <motion.p 
            className={styles.formSubtitle}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Vui lòng điền chính xác thông tin để BTC có thể liên hệ xác nhận với bạn.
          </motion.p>
        </div>

        {/* Global Error */}
        <AnimatePresence>
          {state.globalError && (
            <motion.div
              className={styles.globalError}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.3 }}
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle size={18} />
              <div className={styles.errorContent}>
                <span className={styles.errorText}>{state.globalError}</span>
                {state.globalError.includes('kết nối') && (
                  <button
                    type="button"
                    className={styles.retryButton}
                    onClick={handleRetry}
                  >
                    <RefreshCw size={14} />
                    Thử lại
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields */}
        <div className={styles.formFields}>
          {/* Full Name */}
          <motion.div 
            className={styles.fieldGroup}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className={styles.fieldLabel} htmlFor="fullName">
              <User size={16} aria-hidden="true" />
              <span>Họ và tên <span className={styles.required} aria-label="bắt buộc">*</span></span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                ref={firstFieldRef}
                id="fullName"
                type="text"
                className={`${styles.fieldInput} ${hasFieldError('fullName') ? styles.error : ''}`}
                placeholder="Nhập họ và tên đầy đủ"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={state.isSubmitting}
                autoComplete="name"
                data-field="fullName"
                aria-describedby={hasFieldError('fullName') ? 'fullName-error' : undefined}
                aria-invalid={hasFieldError('fullName')}
              />
              <AnimatePresence>
                {hasFieldError('fullName') && (
                  <motion.div
                    id="fullName-error"
                    className={styles.fieldError}
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    role="alert"
                  >
                    <AlertCircle size={14} />
                    <span>{getFieldError('fullName')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div 
            className={styles.fieldGroup}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className={styles.fieldLabel} htmlFor="phone">
              <Phone size={16} aria-hidden="true" />
              <span>Số điện thoại <span className={styles.required} aria-label="bắt buộc">*</span></span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="phone"
                type="tel"
                className={`${styles.fieldInput} ${hasFieldError('phone') ? styles.error : ''}`}
                placeholder="0901234567"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={state.isSubmitting}
                autoComplete="tel"
                data-field="phone"
                aria-describedby={hasFieldError('phone') ? 'phone-error' : undefined}
                aria-invalid={hasFieldError('phone')}
              />
              <AnimatePresence>
                {hasFieldError('phone') && (
                  <motion.div
                    id="phone-error"
                    className={styles.fieldError}
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    role="alert"
                  >
                    <AlertCircle size={14} />
                    <span>{getFieldError('phone')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div 
            className={styles.fieldGroup}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className={styles.fieldLabel} htmlFor="email">
              <Mail size={16} aria-hidden="true" />
              <span>Email <span className={styles.required} aria-label="bắt buộc">*</span></span>
            </label>
            <div className={styles.inputWrapper}>
              <input
                id="email"
                type="email"
                className={`${styles.fieldInput} ${hasFieldError('email') ? styles.error : ''}`}
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={state.isSubmitting}
                autoComplete="email"
                data-field="email"
                aria-describedby={hasFieldError('email') ? 'email-error' : undefined}
                aria-invalid={hasFieldError('email')}
              />
              <AnimatePresence>
                {hasFieldError('email') && (
                  <motion.div
                    id="email-error"
                    className={styles.fieldError}
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    role="alert"
                  >
                    <AlertCircle size={14} />
                    <span>{getFieldError('email')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Region (for preliminary round) */}
          {event.hasRegion && (
            <motion.div 
              className={styles.fieldGroup}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className={styles.fieldLabel} htmlFor="region">
                <MapPin size={16} aria-hidden="true" />
                <span>Khu vực thi <span className={styles.required} aria-label="bắt buộc">*</span></span>
              </label>
              <div className={styles.inputWrapper}>
                <select
                  id="region"
                  className={`${styles.fieldSelect} ${hasFieldError('region') ? styles.error : ''}`}
                  value={formData.region || ''}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  disabled={state.isSubmitting}
                  data-field="region"
                  aria-describedby={hasFieldError('region') ? 'region-error' : undefined}
                  aria-invalid={hasFieldError('region')}
                >
                  <option value="">-- Chọn khu vực --</option>
                  <option value="HN">Hà Nội (09/11/2025)</option>
                  <option value="DN">Đà Nẵng (16/11/2025)</option>
                  <option value="HCM">TP.HCM (23/11/2025)</option>
                </select>
                <AnimatePresence>
                  {hasFieldError('region') && (
                    <motion.div
                      id="region-error"
                      className={styles.fieldError}
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      role="alert"
                    >
                      <AlertCircle size={14} />
                      <span>{getFieldError('region')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Contestant ID (for semi-final) */}
          {event.hasContestantId && (
            <motion.div 
              className={styles.fieldGroup}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <label className={styles.fieldLabel} htmlFor="contestantId">
                <Crown size={16} aria-hidden="true" />
                <span>Mã thí sinh (nếu có)</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  id="contestantId"
                  type="text"
                  className={`${styles.fieldInput} ${hasFieldError('contestantId') ? styles.error : ''}`}
                  placeholder="Nhập mã thí sinh được cấp"
                  value={formData.contestantId || ''}
                  onChange={(e) => handleInputChange('contestantId', e.target.value)}
                  disabled={state.isSubmitting}
                  data-field="contestantId"
                  aria-describedby={hasFieldError('contestantId') ? 'contestantId-error' : undefined}
                  aria-invalid={hasFieldError('contestantId')}
                />
                <AnimatePresence>
                  {hasFieldError('contestantId') && (
                    <motion.div
                      id="contestantId-error"
                      className={styles.fieldError}
                      initial={{ opacity: 0, height: 0, y: -5 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      role="alert"
                    >
                      <AlertCircle size={14} />
                      <span>{getFieldError('contestantId')}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Confirmation Checkbox */}
          <motion.div 
            className={styles.checkboxGroup}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className={`${styles.checkboxWrapper} ${hasFieldError('confirmed') ? styles.error : ''}`}>
              <label className={styles.checkboxLabel} htmlFor="confirmed">
                <input
                  id="confirmed"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={formData.confirmed}
                  onChange={(e) => handleInputChange('confirmed', e.target.checked)}
                  disabled={state.isSubmitting}
                  data-field="confirmed"
                  aria-describedby={hasFieldError('confirmed') ? 'confirmed-error' : undefined}
                  aria-invalid={hasFieldError('confirmed')}
                />
                <span className={styles.checkboxText}>
                  Tôi xác nhận sẽ tham dự sự kiện đúng thời gian
                  <span className={styles.required} aria-label="bắt buộc"> *</span>
                </span>
              </label>
              <AnimatePresence>
                {hasFieldError('confirmed') && (
                  <motion.div
                    id="confirmed-error"
                    className={styles.fieldError}
                    initial={{ opacity: 0, height: 0, y: -5 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    role="alert"
                  >
                    <AlertCircle size={14} />
                    <span>{getFieldError('confirmed')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div
          className={styles.submitSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <button
            ref={submitButtonRef}
            type="submit"
            className={`${styles.submitButton} ${state.isSubmitting ? styles.loading : ''}`}
            disabled={state.isSubmitting}
            aria-describedby="submit-status"
          >
            <motion.div
              className={styles.submitContent}
              whileHover={!state.isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!state.isSubmitting ? { scale: 0.98 } : {}}
            >
              {state.isSubmitting ? (
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
            </motion.div>
            {!state.isSubmitting && <div className={styles.submitShine} />}
          </button>
          
          {state.isSubmitting && (
            <motion.div
              id="submit-status"
              className={styles.submitStatus}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              aria-live="polite"
            >
              <Clock size={14} />
              <span>Đang xử lý, vui lòng chờ...</span>
            </motion.div>
          )}
        </motion.div>

        {/* Form Footer */}
        <motion.div 
          className={styles.formFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <div className={styles.footerItem}>
            <Shield size={12} />
            <span>Thông tin được bảo mật</span>
          </div>
          <div className={styles.footerItem}>
            <Clock size={12} />
            <span>Hoàn tất trong ~30 giây</span>
          </div>
          <div className={styles.footerLove}>
            <Heart size={12} className={styles.heartIcon} />
            <span>Được tạo với ❤️ bởi TingNect</span>
          </div>
        </motion.div>
      </motion.form>
    </div>
  )
}

export default CheckinForm