import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { googleSheetsService } from '@/lib/google-sheets';
import { CheckinSubmission } from '@/lib/types';
import { generateConfirmationCode, formatPhoneNumber, validateEmail, validatePhoneNumber } from '@/lib/utils';

const checkinSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  phone: z.string().refine(validatePhoneNumber, 'Số điện thoại không hợp lệ'),
  email: z.string().refine(validateEmail, 'Email không hợp lệ'),
  confirmed: z.boolean().refine(val => val === true, 'Bạn phải xác nhận tham dự'),
  round: z.enum(['hop-bao', 'so-khao', 'ban-ket', 'chung-ket']),
  region: z.enum(['HN', 'DN', 'HCM']).optional(),
  contestantId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received checkin request:', { round: body.round, email: body.email });
    
    // Validate input
    const validationResult = checkinSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.issues); // Thay errors bằng issues
      return NextResponse.json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        error: validationResult.error.issues[0]?.message, // Thay errors[0] bằng issues[0]
      }, { status: 400 });
    }

    const data = validationResult.data;
    
    // Chuẩn hóa số điện thoại
    const normalizedPhone = formatPhoneNumber(data.phone);
    
    // Kiểm tra trùng lặp (không block nếu có lỗi)
    try {
      const isDuplicate = await googleSheetsService.checkDuplicate(
        data.email, 
        normalizedPhone, 
        data.round
      );

      if (isDuplicate) {
        return NextResponse.json({
          success: false,
          message: 'Bạn đã check-in cho sự kiện này rồi. Vui lòng kiểm tra email hoặc liên hệ BTC.',
        }, { status: 409 });
      }
    } catch (duplicateError) {
      console.log('Duplicate check failed, continuing with submission:', duplicateError);
    }

    // Tạo submission data
    const submission: CheckinSubmission = {
      fullName: data.fullName.trim(),
      phone: normalizedPhone,
      email: data.email.toLowerCase().trim(),
      confirmed: data.confirmed,
      round: data.round,
      region: data.region,
      contestantId: data.contestantId?.trim(),
      timestamp: new Date().toISOString(),
    };

    console.log('Attempting to save to Google Sheets:', { round: data.round });

    // Lưu vào Google Sheets
    const success = await googleSheetsService.appendToSheet(submission);

    if (!success) {
      console.error('Failed to save to Google Sheets');
      return NextResponse.json({
        success: false,
        message: 'Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại sau hoặc liên hệ BTC.',
      }, { status: 500 });
    }

    // Tạo mã xác nhận
    const confirmationCode = generateConfirmationCode(data.round);

    console.log('Checkin successful:', { round: data.round, confirmationCode });

    return NextResponse.json({
      success: true,
      message: 'Đã ghi nhận check-in. Hẹn gặp bạn tại sự kiện!',
      confirmationCode,
    });

  } catch (error) {
    console.error('Checkin API error:', error);
    
    // Chi tiết lỗi để debug
    let errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại sau.';
    
    if (error instanceof Error) {
      if (error.message.includes('API has not been used')) {
        errorMessage = 'Hệ thống đang được cập nhật. Vui lòng thử lại sau 5 phút.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'Lỗi quyền truy cập. Vui lòng liên hệ BTC.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Không tìm thấy dữ liệu. Vui lòng liên hệ BTC.';
      }
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage,
    }, { status: 500 });
  }
}

// Health check endpoint với connection test
export async function GET() {
  try {
    const connectionTest = await googleSheetsService.testConnection();
    
    return NextResponse.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      googleSheets: connectionTest,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}