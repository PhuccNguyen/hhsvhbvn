import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { CheckinSubmission } from './types';

class GoogleSheetsService {
  private sheets!: sheets_v4.Sheets;
  private auth!: JWT;
  private isInitialized = false;

  constructor() {
    this.initializeAuth().catch(err => console.error('Initialization failed:', err));
  }

  private async initializeAuth() {
    if (this.isInitialized) return;

    try {
      // Kiểm tra environment variables
      if (!process.env.GOOGLE_PROJECT_ID) {
        throw new Error('Missing GOOGLE_PROJECT_ID environment variable');
      }
      if (!process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('Missing GOOGLE_PRIVATE_KEY environment variable');
      }
      if (!process.env.GOOGLE_CLIENT_EMAIL) {
        throw new Error('Missing GOOGLE_CLIENT_EMAIL environment variable');
      }
      if (!process.env.GOOGLE_SHEET_ID) {
        throw new Error('Missing GOOGLE_SHEET_ID environment variable');
      }

      // Điều chỉnh credentials cho JWT
      const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };

      this.auth = new google.auth.JWT({
        email: credentials.client_email, // Sử dụng email trực tiếp
        key: credentials.private_key,   // Sử dụng key trực tiếp
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ],
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      this.isInitialized = true;

      console.log('Google Sheets service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sheets auth:', error);
      throw new Error(`Google Sheets authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async appendToSheet(data: CheckinSubmission): Promise<boolean> {
    try {
      await this.initializeAuth();
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const sheetName = this.getSheetName(data.round);
      
      // Chuẩn bị dữ liệu
      const row = this.prepareRowData(data);
      
      // Đảm bảo sheet tồn tại và có header
      await this.ensureSheetExists(spreadsheetId!, sheetName);
      
      // Thêm dữ liệu
      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:H`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [row],
        },
      });

      console.log(`Successfully appended data to ${sheetName}:`, result.status);
      return result.status === 200;
    } catch (error) {
      console.error('Error appending to sheet:', error);
      
      // Specific error handling
      if (error instanceof Error) {
        if (error.message.includes('API has not been used')) {
          console.error('Google Sheets API is not enabled. Please enable it in Google Cloud Console.');
        } else if (error.message.includes('permission')) {
          console.error('Permission denied. Please check service account permissions.');
        } else if (error.message.includes('not found')) {
          console.error('Spreadsheet not found. Please check GOOGLE_SHEET_ID.');
        }
      }
      
      return false;
    }
  }

  async checkDuplicate(email: string, phone: string, round: string): Promise<boolean> {
    try {
      await this.initializeAuth();
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const sheetName = this.getSheetName(round);
      
      // Đảm bảo sheet tồn tại trước khi đọc
      await this.ensureSheetExists(spreadsheetId!, sheetName);
      
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:H`,
      });

      const rows = result.data.values || [];
      
      // Bỏ qua header row
      const dataRows = rows.slice(1);
      
      return dataRows.some((row: string[]) => {
        const rowEmail = row[3]?.toLowerCase().trim(); // Email ở cột D
        const rowPhone = row[2]?.trim(); // Phone ở cột C
        return rowEmail === email.toLowerCase().trim() || rowPhone === phone;
      });
    } catch (error) {
      console.error('Error checking duplicate:', error);
      // Trong trường hợp lỗi, trả về false để không block user
      return false;
    }
  }

  private async ensureSheetExists(spreadsheetId: string, sheetName: string) {
    try {
      // Kiểm tra xem sheet đã tồn tại chưa
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId,
      });

      const existingSheet = spreadsheet.data.sheets?.find(
        (sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title === sheetName
      );

      if (!existingSheet) {
        // Tạo sheet mới
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        });
        console.log(`Created new sheet: ${sheetName}`);
      }

      // Đảm bảo header tồn tại
      await this.ensureHeaderExists(spreadsheetId, sheetName);
    } catch (error) {
      console.error('Error ensuring sheet exists:', error);
      throw error;
    }
  }

  private async ensureHeaderExists(spreadsheetId: string, sheetName: string) {
    try {
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:H1`,
      });

      if (!result.data.values || result.data.values.length === 0) {
        // Tạo header row
        const headers = [
          'Timestamp',
          'Họ và tên',
          'Số điện thoại',
          'Email',
          'Khu vực',
          'Mã thí sinh',
          'Xác nhận',
          'Vòng thi',
        ];

        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1:H1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [headers],
          },
        });
        console.log(`Created header for sheet: ${sheetName}`);
      }
    } catch (error) {
      console.error('Error ensuring header exists:', error);
      throw error;
    }
  }

  private getSheetName(round: string): string {
    const sheetNames = {
      'hop-bao': 'HopBao',
      'so-khao': 'SoKhao',
      'ban-ket': 'BanKet',
      'chung-ket': 'ChungKet',
    };
    return sheetNames[round as keyof typeof sheetNames] || 'Unknown';
  }

  private prepareRowData(data: CheckinSubmission): string[] {
    return [
      new Date(data.timestamp).toLocaleString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      data.fullName,
      data.phone,
      data.email,
      data.region || '',
      data.contestantId || '',
      data.confirmed ? 'Có' : 'Không',
      data.round,
    ];
  }

  // Test connection method
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      await this.initializeAuth();
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      await this.sheets.spreadsheets.get({ spreadsheetId });
      
      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();