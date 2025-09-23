import { google, sheets_v4 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { CheckinSubmission, DuplicateDetails } from './types';
import { retryOperation } from './utils';

interface DuplicateCheckResult {
  isDuplicate: boolean
  details: DuplicateDetails
}

interface RateLimiter {
  (key: string): { allowed: boolean; retryAfter: number };
}

export function createRateLimiter(limit: number, window: number): RateLimiter {
  const requests: { [key: string]: number[] } = {};
  
  return (key: string) => {
    const now = Date.now();
    const windowStart = now - window;
    
    requests[key] = requests[key]?.filter(time => time > windowStart) || [];
    
    if (requests[key].length < limit) {
      requests[key].push(now);
      return { allowed: true, retryAfter: 0 };
    }
    
    const oldestRequest = requests[key][0];
    const retryAfter = Math.ceil((oldestRequest + window - now) / 1000);
    return { allowed: false, retryAfter };
  };
}


class GoogleSheetsService {
  private sheets!: sheets_v4.Sheets;
  private auth!: JWT;
  private isInitialized = false;
  private rateLimiter = createRateLimiter(100, 60000); // 100 requests per minute

  constructor() {
    this.initializeAuth().catch(err => console.error('Initialization failed:', err));
  }

  private async initializeAuth() {
    if (this.isInitialized) return;

    try {
      if (!process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_PRIVATE_KEY || 
          !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_SHEET_ID) {
        throw new Error('Missing required Google Sheets environment variables');
      }

      const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };

      this.auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
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
    return retryOperation(async () => {
      await this.initializeAuth();
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const sheetName = this.getSheetName(data.round);
      
      // Rate limiting
      const rateCheck = this.rateLimiter(`append_${data.round}`)
      if (!rateCheck.allowed) {
        throw new Error(`Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.`)
      }
      
      const row = this.prepareRowData(data);
      await this.ensureSheetExists(spreadsheetId!, sheetName);
      
      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:J`, // Extended to include confirmation code and IP columns
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [row],
        },
      });

      console.log(`Successfully appended data to ${sheetName}:`, result.status);
      return result.status === 200;
    }, 3, 1000);
  }

  async checkDuplicate(
    email: string, 
    phone: string, 
    round: string, 
    contestantId?: string
  ): Promise<DuplicateCheckResult> {
    return retryOperation(async () => {
      await this.initializeAuth();
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const sheetName = this.getSheetName(round);
      
      // Rate limiting
      const rateCheck = this.rateLimiter(`check_${round}`)
      if (!rateCheck.allowed) {
        throw new Error(`Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.`)
      }
      
      await this.ensureSheetExists(spreadsheetId!, sheetName);
      
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:I`,
      });

      const rows = result.data.values || [];
      const dataRows = rows.slice(1); // Skip header
      
      const details: DuplicateDetails = {
        email: false,
        phone: false,
        contestantId: false
      };

      let isDuplicate = false;
      const duplicateMessages: string[] = [];

      for (const row of dataRows) {
        const rowEmail = row[3]?.toLowerCase().trim(); // Email in column D
        const rowPhone = row[2]?.trim(); // Phone in column C  
        const rowContestantId = row[5]?.trim(); // Contestant ID in column F

        // Check email duplicate
        if (rowEmail && rowEmail === email.toLowerCase().trim()) {
          details.email = true;
          isDuplicate = true;
          duplicateMessages.push('Email đã được sử dụng');
        }

        // Check phone duplicate
        if (rowPhone && rowPhone === phone) {
          details.phone = true;
          isDuplicate = true;
          duplicateMessages.push('Số điện thoại đã được sử dụng');
        }

        // Check contestant ID duplicate (if provided)
        if (contestantId && rowContestantId && rowContestantId === contestantId.trim()) {
          details.contestantId = true;
          isDuplicate = true;
          duplicateMessages.push('Mã thí sinh đã được sử dụng');
        }

        if (isDuplicate) break; // Early exit on first duplicate found
      }

      if (isDuplicate) {
        details.message = duplicateMessages.join(', ');
      }

      return { isDuplicate, details };
    }, 2, 500);
  }

  private async ensureSheetExists(spreadsheetId: string, sheetName: string) {
    try {
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId,
      });

      const existingSheet = spreadsheet.data.sheets?.find(
        (sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title === sheetName
      );

      if (!existingSheet) {
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
        range: `${sheetName}!A1:J1`,
      });

      if (!result.data.values || result.data.values.length === 0) {
        const headers = [
          'Timestamp',
          'Họ và tên', 
          'Số điện thoại',
          'Email',
          'Khu vực',
          'Mã thí sinh',
          'Xác nhận',
          'Vòng thi',
          'Mã tham chiếu', // Add confirmation code column
          'IP Address'
        ];

        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1:J1`,
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

  private prepareRowData(data: CheckinSubmission, ipAddress?: string): string[] {
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
      data.confirmationCode, // Add confirmation code
      ipAddress || 'Unknown'
    ];
  }

  async getSheetStats(round: string): Promise<{ total: number; recent: number }> {
    try {
      await this.initializeAuth();
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const sheetName = this.getSheetName(round);
      
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:A`,
      });

      const rows = result.data.values || [];
      const total = Math.max(0, rows.length - 1); // Exclude header
      
      // Count recent registrations (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      let recent = 0;
      
      for (let i = 1; i < rows.length; i++) { // Skip header
        try {
          const timestampStr = rows[i][0];
          if (timestampStr) {
            const rowDate = new Date(timestampStr);
            if (rowDate > yesterday) {
              recent++;
            }
          }
        } catch (e) {
          // Skip invalid date entries
        }
      }
      
      return { total, recent };
    } catch (error) {
      console.error('Error getting sheet stats:', error);
      return { total: 0, recent: 0 };
    }
  }

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
