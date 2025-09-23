import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { googleSheetsService } from '@/lib/google-sheets';
import { CheckinSubmission, CheckinResponse } from '@/lib/types';
import { 
  generateConfirmationCode, 
  hashConfirmationCode,
  formatPhoneNumber, 
  validateEmail, 
  validatePhoneNumber,
  validateFullName,
  logCheckinAttempt,
  createRateLimiter
} from '@/lib/utils';
import { getEventStatusRealtime } from '@/data/events';

const checkinSchema = z.object({
  fullName: z.string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(100, 'Họ tên không được quá 100 ký tự')
    .refine(validateFullName, 'Họ tên chỉ được chứa chữ cái và khoảng trắng'),
  phone: z.string().refine(validatePhoneNumber, 'Số điện thoại không hợp lệ'),
  email: z.string().refine(validateEmail, 'Email không hợp lệ'),
  confirmed: z.boolean().refine(val => val === true, 'Bạn phải xác nhận tham dự'),
  round: z.enum(['hop-bao', 'so-khao', 'ban-ket', 'chung-ket']),
  region: z.enum(['HN', 'DN', 'HCM']).optional(),
  contestantId: z.string().max(50, 'Mã thí sinh không được quá 50 ký tự').optional(),
});

// Rate limiter: 5 requests per minute per IP
const rateLimiter = createRateLimiter(5, 60000);

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP.trim()
  }
  
  return 'unknown'
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const clientIP = getClientIP(request)
  
  try {
    // Rate limiting
    const rateCheck = rateLimiter(clientIP)
    if (!rateCheck.allowed) {
      logCheckinAttempt({
        email: 'rate-limited',
        round: 'unknown',
        success: false,
        error: 'Rate limit exceeded',
        clientIP,
        action: 'rate_limit',
        processingTime: Date.now() - startTime,
        details: { retryAfter: rateCheck.retryAfter }
      })
      
      return NextResponse.json({
        success: false,
        message: `Quá nhiều yêu cầu. Vui lòng thử lại sau ${rateCheck.retryAfter} giây.`,
        retryAfter: rateCheck.retryAfter
      }, { status: 429 })
    }

    const body = await request.json()
    console.log(`[CHECKIN] Request from ${clientIP}:`, { round: body.round, email: body.email?.substring(0, 3) + '***' })
    
    // Validate input
    const validationResult = checkinSchema.safeParse(body)
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      
      logCheckinAttempt({
        email: body.email || 'unknown',
        round: body.round || 'unknown',
        success: false,
        error: `Validation failed: ${firstError?.message}`,
        clientIP,
        action: 'validation_failed',
        processingTime: Date.now() - startTime,
        details: { validationError: firstError }
      })
      
      return NextResponse.json({
        success: false,
        message: firstError?.message || 'Dữ liệu không hợp lệ',
        error: firstError?.message,
      }, { status: 400 })
    }

    const data = validationResult.data

    // Check event status
    const eventStatus = getEventStatusRealtime(data.round)
    if (!eventStatus.canRegister) {
      logCheckinAttempt({
        email: data.email,
        round: data.round,
        success: false,
        error: `Event not open for registration: ${eventStatus.message}`,
        clientIP,
        action: 'event_closed',
        processingTime: Date.now() - startTime,
        details: { eventStatus }
      })
      
      return NextResponse.json({
        success: false,
        message: eventStatus.message || 'Sự kiện không mở đăng ký',
      }, { status: 403 })
    }
    
    // Normalize data
    const normalizedPhone = formatPhoneNumber(data.phone)
    const normalizedEmail = data.email.toLowerCase().trim()
    
    // Enhanced duplicate check with detailed feedback
    try {
      const duplicateResult = await googleSheetsService.checkDuplicate(
        normalizedEmail, 
        normalizedPhone, 
        data.round,
        data.contestantId
      )

      if (duplicateResult.isDuplicate) {
        logCheckinAttempt({
          email: normalizedEmail,
          round: data.round,
          success: false,
          error: 'Duplicate entry',
          duplicateFields: Object.keys(duplicateResult.details).filter(key => 
            duplicateResult.details[key as keyof typeof duplicateResult.details] === true
          ),
          clientIP,
          action: 'duplicate_detected',
          processingTime: Date.now() - startTime,
          details: { duplicateResult }
        })

        return NextResponse.json({
          success: false,
          message: duplicateResult.details.message || 'Thông tin đã được sử dụng',
          duplicateFields: duplicateResult.details,
        }, { status: 409 })
      }
    } catch (duplicateError) {
      console.warn(`[CHECKIN] Duplicate check failed for ${data.round}, continuing:`, duplicateError)
      // Continue with submission if duplicate check fails
    }

    // Generate confirmation code for both sheet and client
    const confirmationCode = generateConfirmationCode(data.round)

    // Create submission data with confirmation code
    const submission: CheckinSubmission = {
      fullName: data.fullName.trim(),
      phone: normalizedPhone,
      email: normalizedEmail,
      confirmed: data.confirmed,
      round: data.round,
      region: data.region,
      contestantId: data.contestantId?.trim(),
      timestamp: new Date().toISOString(),
      confirmationCode, // Add confirmation code to sheet
    }

    console.log(`[CHECKIN] Saving to Google Sheets: ${data.round} with code: ${confirmationCode}`)

    // Save to Google Sheets with retry mechanism
    const success = await googleSheetsService.appendToSheet(submission)

    if (!success) {
      logCheckinAttempt({
        email: normalizedEmail,
        round: data.round,
        success: false,
        error: 'Failed to save to Google Sheets',
        clientIP,
        action: 'save_failed',
        processingTime: Date.now() - startTime
      })
      
      return NextResponse.json({
        success: false,
        message: 'Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại sau hoặc liên hệ BTC.',
      }, { status: 500 })
    }

    // Save to localStorage for multi-device protection
    const responseData: CheckinResponse = {
      success: true,
      message: getSuccessMessage(data.round, data.region),
      confirmationCode: confirmationCode, // Send original code to client
    }

    logCheckinAttempt({
      email: normalizedEmail,
      round: data.round,
      success: true,
      clientIP,
      action: 'checkin_success',
      processingTime: Date.now() - startTime,
      details: { confirmationCode: confirmationCode } // Log original code
    })

    const processingTime = Date.now() - startTime
    console.log(`[CHECKIN] Success for ${data.round}: ${processingTime}ms`)

    return NextResponse.json(responseData)

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`[CHECKIN] Error after ${processingTime}ms:`, error)
    
    // Detailed error handling
    let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    let statusCode = 500
    
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        errorMessage = error.message
        statusCode = 429
      } else if (error.message.includes('API has not been used')) {
        errorMessage = 'Hệ thống đang được cập nhật. Vui lòng thử lại sau 5 phút.'
      } else if (error.message.includes('permission')) {
        errorMessage = 'Lỗi quyền truy cập. Vui lòng liên hệ BTC.'
      } else if (error.message.includes('not found')) {
        errorMessage = 'Không tìm thấy dữ liệu. Vui lòng liên hệ BTC.'
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Hệ thống đang bận. Vui lòng thử lại sau ít phút.'
      }
    }
    
    logCheckinAttempt({
      email: 'unknown',
      round: 'unknown',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      clientIP,
      action: 'error',
      processingTime: Date.now() - startTime,
      details: { 
        statusCode,
        errorMessage,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      }
    })
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
    }, { status: statusCode })
  }
}

function getSuccessMessage(round: string, region?: string): string {
  switch (round) {
    case 'hop-bao':
      return 'Đã ghi nhận check-in Họp báo. BTC sẽ liên hệ với bạn trong 24h tới!'
    case 'so-khao':
      const regionName = region === 'HN' ? 'Hà Nội' : region === 'DN' ? 'Đà Nẵng' : 'TP.HCM'
      return `Đã ghi nhận check-in Sơ khảo khu vực ${regionName}. BTC sẽ thông báo lịch thi cụ thể!`
    case 'ban-ket':
      return 'Đã ghi nhận check-in Bán kết. BTC sẽ xác thực thông tin và hướng dẫn chi tiết!'
    case 'chung-ket':
      return 'Đã ghi nhận check-in Chung kết! Hẹn gặp bạn tại Cung Tiên Sơn – Đà Nẵng!'
    default:
      return 'Check-in thành công! Cảm ơn bạn đã tham gia HHSV Hòa Bình Việt Nam 2025!'
  }
}

// Enhanced health check endpoint
export async function GET(request: NextRequest) {
  try {
    const clientIP = getClientIP(request)
    const connectionTest = await googleSheetsService.testConnection()
    
    // Get basic stats for open events
    type EventStats = { total: number; recent: number; error?: string };
    const stats: Record<string, EventStats> = {}
    const openEvents = ['hop-bao', 'so-khao', 'ban-ket', 'chung-ket']
    
    for (const round of openEvents) {
      try {
        const eventStats = await googleSheetsService.getSheetStats(round)
        stats[round] = eventStats
      } catch (e) {
        stats[round] = { total: 0, recent: 0, error: 'Unable to fetch' }
      }
    }
    
    return NextResponse.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      clientIP,
      googleSheets: connectionTest,
      eventStats: stats,
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}


