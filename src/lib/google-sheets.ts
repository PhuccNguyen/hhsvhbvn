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

// Enhanced private key processor with better formatting
function processPrivateKey(): string {
  console.log('[GOOGLE_SHEETS] Processing private key...');
  
  let privateKey: string | undefined;
  
  // Method 1: Try GOOGLE_PRIVATE_KEY_B64 (base64 encoded)
  if (process.env.GOOGLE_PRIVATE_KEY_B64) {
    try {
      console.log('[GOOGLE_SHEETS] Attempting base64 decode...');
      const base64Key = process.env.GOOGLE_PRIVATE_KEY_B64.trim();
      
      // Check if it's actually base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(base64Key)) {
        throw new Error('Invalid base64 format');
      }
      
      const decoded = Buffer.from(base64Key, 'base64').toString('utf8');
      
      if (decoded.includes('-----BEGIN PRIVATE KEY-----') && decoded.includes('-----END PRIVATE KEY-----')) {
        // CRITICAL FIX: Ensure proper line formatting
        privateKey = formatPrivateKey(decoded);
        console.log('[GOOGLE_SHEETS] ✅ Successfully decoded and formatted base64 private key');
        console.log('[GOOGLE_SHEETS] Key length:', privateKey.length);
        console.log('[GOOGLE_SHEETS] Key lines:', privateKey.split('\n').length);
      } else {
        console.warn('[GOOGLE_SHEETS] ❌ Base64 decoded but missing PEM markers');
      }
    } catch (error) {
      console.warn('[GOOGLE_SHEETS] ❌ Base64 decode failed:', error);
    }
  }
  
  // Method 2: Try GOOGLE_PRIVATE_KEY (plain text with potential escape sequences)
  if (!privateKey && process.env.GOOGLE_PRIVATE_KEY) {
    try {
      console.log('[GOOGLE_SHEETS] Attempting plain text key processing...');
      let plainKey = process.env.GOOGLE_PRIVATE_KEY.trim();
      
      // Remove surrounding quotes if present
      if ((plainKey.startsWith('"') && plainKey.endsWith('"')) || 
          (plainKey.startsWith("'") && plainKey.endsWith("'"))) {
        plainKey = plainKey.slice(1, -1);
        console.log('[GOOGLE_SHEETS] Removed surrounding quotes');
      }
      
      // Replace escaped newlines with actual newlines
      plainKey = plainKey.replace(/\\n/g, '\n');
      
      if (plainKey.includes('-----BEGIN PRIVATE KEY-----') && plainKey.includes('-----END PRIVATE KEY-----')) {
        // CRITICAL FIX: Ensure proper line formatting
        privateKey = formatPrivateKey(plainKey);
        console.log('[GOOGLE_SHEETS] ✅ Successfully processed and formatted plain text private key');
        console.log('[GOOGLE_SHEETS] Key length:', privateKey.length);
        console.log('[GOOGLE_SHEETS] Key lines:', privateKey.split('\n').length);
      } else {
        console.warn('[GOOGLE_SHEETS] ❌ Plain text key missing PEM markers');
      }
    } catch (error) {
      console.warn('[GOOGLE_SHEETS] ❌ Plain text key processing failed:', error);
    }
  }
  
  if (!privateKey) {
    console.error('[GOOGLE_SHEETS] ❌ No valid private key found');
    throw new Error('No valid private key found in environment variables');
  }
  
  // Final validation
  const lines = privateKey.split('\n');
  const beginLine = lines.find(line => line.includes('BEGIN PRIVATE KEY'));
  const endLine = lines.find(line => line.includes('END PRIVATE KEY'));
  
  if (!beginLine || !endLine) {
    console.error('[GOOGLE_SHEETS] ❌ Private key structure invalid');
    console.log('[GOOGLE_SHEETS] Lines found:', lines.length);
    console.log('[GOOGLE_SHEETS] First line:', lines[0]);
    console.log('[GOOGLE_SHEETS] Last line:', lines[lines.length - 1]);
    throw new Error('Private key is missing required BEGIN/END markers');
  }
  
  // CRITICAL: Validate line count (should be more than 3 lines for proper PEM format)
  if (lines.length < 4) {
    console.error('[GOOGLE_SHEETS] ❌ Private key has too few lines:', lines.length);
    console.log('[GOOGLE_SHEETS] This suggests improper formatting');
    throw new Error('Private key format invalid - insufficient line breaks');
  }
  
  console.log('[GOOGLE_SHEETS] ✅ Private key validation successful');
  console.log('[GOOGLE_SHEETS] Key has', lines.length, 'lines');
  
  return privateKey;
}

// NEW: Private key formatter function with enhanced PEM formatting
function formatPrivateKey(keyContent: string): string {
  console.log('[GOOGLE_SHEETS] Formatting private key...');
  
  // First remove any extra whitespace and normalize newlines
  let key = keyContent.replace(/\r\n/g, '\n').trim();
  
  // Remove any existing line breaks between the markers to start fresh
  key = key.replace(/-----BEGIN PRIVATE KEY-----\s+/, '-----BEGIN PRIVATE KEY-----')
           .replace(/\s+-----END PRIVATE KEY-----/, '-----END PRIVATE KEY-----');
           
  // Extract just the base64 content between the markers
  const matches = key.match(/-----BEGIN PRIVATE KEY-----([\s\S]+?)-----END PRIVATE KEY-----/);
  if (!matches || !matches[1]) {
    throw new Error('Invalid private key format - cannot extract key content');
  }
  
  // Clean up the base64 content - remove all whitespace
  const base64Content = matches[1].replace(/[\s\n\r]/g, '');
  
  // Build the key with proper PEM format:
  // 1. Begin marker
  // 2. Base64 in 64-character lines
  // 3. End marker
  const lines = [
    '-----BEGIN PRIVATE KEY-----'
  ];
  
  // Split base64 into 64-character lines
  let position = 0;
  while (position < base64Content.length) {
    lines.push(base64Content.slice(position, position + 64));
    position += 64;
  }
  
  lines.push('-----END PRIVATE KEY-----');
  
  // Join with proper line endings
  const formattedKey = lines.join('\n');
  
  console.log('[GOOGLE_SHEETS] Key formatted to', lines.length, 'lines');
  console.log('[GOOGLE_SHEETS] Final key format validation...');
  
  // Final validation
  if (!formattedKey.startsWith('-----BEGIN PRIVATE KEY-----\n') || 
      !formattedKey.endsWith('\n-----END PRIVATE KEY-----')) {
    throw new Error('Key formatting failed - invalid markers placement');
  }
  
  if (lines.length < 3) {
    throw new Error('Key formatting failed - insufficient content');
  }
  
  // Verify base64 content
  const base64Lines = lines.slice(1, -1);
  const base64Valid = base64Lines.every(line => /^[A-Za-z0-9+/=]{1,64}$/.test(line));
  if (!base64Valid) {
    throw new Error('Key formatting failed - invalid base64 content');
  }
  
  return formattedKey;
}

class GoogleSheetsService {
  private sheets!: sheets_v4.Sheets;
  private auth!: JWT;
  private isInitialized = false;
  private initializationPromise: Promise<void> | null = null;
  private rateLimiter = createRateLimiter(100, 60000); // 100 requests per minute

  constructor() {
    // Don't initialize in constructor, wait for first method call
  }

  private async initializeAuth(): Promise<void> {
    if (this.isInitialized) return;
    
    // Prevent multiple simultaneous initialization attempts
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  private async _performInitialization(): Promise<void> {
    try {
      console.log('[GOOGLE_SHEETS] Starting authentication initialization...');
      
      // Check required environment variables
      const requiredVars = {
        GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
        GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
        GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
      };

      const missingVars = Object.entries(requiredVars)
        .filter(([, value]) => !value)
        .map(([key]) => key);

      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

      if (!process.env.GOOGLE_PRIVATE_KEY && !process.env.GOOGLE_PRIVATE_KEY_B64) {
        throw new Error('Missing private key: Neither GOOGLE_PRIVATE_KEY nor GOOGLE_PRIVATE_KEY_B64 is set');
      }

      console.log('[GOOGLE_SHEETS] Environment variables check passed');
      console.log('[GOOGLE_SHEETS] Project ID:', process.env.GOOGLE_PROJECT_ID);
      console.log('[GOOGLE_SHEETS] Client Email:', process.env.GOOGLE_CLIENT_EMAIL);
      console.log('[GOOGLE_SHEETS] Sheet ID:', process.env.GOOGLE_SHEET_ID?.substring(0, 10) + '...');

      // Process private key with enhanced error handling
      const privateKey = processPrivateKey();

      const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        private_key: privateKey,
      };

      console.log('[GOOGLE_SHEETS] Creating JWT authentication...');
      
      this.auth = new google.auth.JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ],
      });

      // Test authentication by getting access token
      console.log('[GOOGLE_SHEETS] Testing authentication...');
      const accessToken = await this.auth.getAccessToken();
      if (!accessToken.token) {
        throw new Error('Failed to get access token - authentication failed');
      }
      console.log('[GOOGLE_SHEETS] ✅ Access token obtained successfully');

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      
      // Test API connection
      // Test the API connection directly instead of using testConnection() to avoid recursion
      console.log('[GOOGLE_SHEETS] Testing API connection...');
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const result = await this.sheets.spreadsheets.get({ spreadsheetId });
      
      if (!result.data.spreadsheetId) {
        throw new Error('Failed to connect to spreadsheet');
      }

      console.log(`[GOOGLE_SHEETS] ✅ Connected to spreadsheet: "${result.data.properties?.title}"`);
      this.isInitialized = true;
      console.log('[GOOGLE_SHEETS] ✅ Initialization completed successfully');

    } catch (error) {
      console.error('[GOOGLE_SHEETS] ❌ Initialization failed:', error);
      this.initializationPromise = null; // Reset so we can try again
      
      // Enhanced error reporting
      if (error instanceof Error) {
        if (error.message.includes('DECODER routines')) {
          throw new Error(`Private key decoding failed: ${error.message}. Please check your private key format.`);
        } else if (error.message.includes('invalid_client')) {
          throw new Error(`Google API authentication failed: Invalid client credentials. Please verify your client email and private key.`);
        } else if (error.message.includes('access_denied')) {
          throw new Error(`Google API access denied: Please ensure the service account has proper permissions.`);
        }
      }
      
      throw new Error(`Google Sheets authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async appendToSheet(data: CheckinSubmission): Promise<boolean> {
    return retryOperation(async () => {
      await this.initializeAuth();
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const sheetName = this.getSheetName(data.round);
      
      console.log(`[GOOGLE_SHEETS] Appending to sheet: ${sheetName}`);
      
      // Rate limiting
      const rateCheck = this.rateLimiter(`append_${data.round}`)
      if (!rateCheck.allowed) {
        throw new Error(`Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.`)
      }
      
      const row = this.prepareRowData(data);
      await this.ensureSheetExists(spreadsheetId!, sheetName);
      
      console.log(`[GOOGLE_SHEETS] Prepared row data:`, row.map((cell, i) => `${i}: ${typeof cell === 'string' && cell.length > 50 ? cell.substring(0, 50) + '...' : cell}`));
      
      const result = await this.sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A:K`,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [row],
        },
      });

      console.log(`[GOOGLE_SHEETS] ✅ Successfully appended data to ${sheetName}, status: ${result.status}`);
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
      
      console.log(`[GOOGLE_SHEETS] Checking duplicates in ${sheetName} for email: ${email}`);
      
      // Rate limiting
      const rateCheck = this.rateLimiter(`check_${round}`)
      if (!rateCheck.allowed) {
        throw new Error(`Rate limit exceeded. Try again in ${rateCheck.retryAfter} seconds.`)
      }
      
      await this.ensureSheetExists(spreadsheetId!, sheetName);
      
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A:K`,
      });

      const rows = result.data.values || [];
      const dataRows = rows.slice(1); // Skip header
      
      console.log(`[GOOGLE_SHEETS] Found ${dataRows.length} existing records to check`);
      
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
        const rowContestantId = row[6]?.trim(); // Contestant ID in column G (shifted due to userType)

        // Check email duplicate
        if (rowEmail && rowEmail === email.toLowerCase().trim()) {
          details.email = true;
          isDuplicate = true;
          duplicateMessages.push('Email đã được sử dụng');
          console.log(`[GOOGLE_SHEETS] Found duplicate email: ${rowEmail}`);
        }

        // Check phone duplicate
        if (rowPhone && rowPhone === phone) {
          details.phone = true;
          isDuplicate = true;
          duplicateMessages.push('Số điện thoại đã được sử dụng');
          console.log(`[GOOGLE_SHEETS] Found duplicate phone: ${rowPhone}`);
        }

        // Check contestant ID duplicate (if provided)
        if (contestantId && rowContestantId && rowContestantId === contestantId.trim()) {
          details.contestantId = true;
          isDuplicate = true;
          duplicateMessages.push('Mã thí sinh đã được sử dụng');
          console.log(`[GOOGLE_SHEETS] Found duplicate contestant ID: ${rowContestantId}`);
        }

        if (isDuplicate) break; // Early exit on first duplicate found
      }

      if (isDuplicate) {
        details.message = duplicateMessages.join(', ');
      }

      console.log(`[GOOGLE_SHEETS] Duplicate check result: ${isDuplicate ? 'DUPLICATE FOUND' : 'NO DUPLICATES'}`);
      return { isDuplicate, details };
    }, 2, 500);
  }

  private async ensureSheetExists(spreadsheetId: string, sheetName: string) {
    try {
      console.log(`[GOOGLE_SHEETS] Checking if sheet exists: ${sheetName}`);
      
      const spreadsheet = await this.sheets.spreadsheets.get({
        spreadsheetId,
      });

      const existingSheet = spreadsheet.data.sheets?.find(
        (sheet: sheets_v4.Schema$Sheet) => sheet.properties?.title === sheetName
      );

      if (!existingSheet) { 
        console.log(`[GOOGLE_SHEETS] Creating new sheet: ${sheetName}`);
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
        console.log(`[GOOGLE_SHEETS] ✅ Created new sheet: ${sheetName}`);
      } else {
        console.log(`[GOOGLE_SHEETS] Sheet already exists: ${sheetName}`);
      }

      await this.ensureHeaderExists(spreadsheetId, sheetName);
    } catch (error) {
      console.error(`[GOOGLE_SHEETS] ❌ Error ensuring sheet exists (${sheetName}):`, error);
      throw error;
    }
  }

  private async ensureHeaderExists(spreadsheetId: string, sheetName: string) {
    try {
      console.log(`[GOOGLE_SHEETS] Checking header for sheet: ${sheetName}`);
      
      const result = await this.sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!A1:K1`,
      });

      if (!result.data.values || result.data.values.length === 0) {
        const headers = [
          'Timestamp',
          'Họ và tên', 
          'Số điện thoại',
          'Email',
          'Phân loại',
          'Khu vực',
          'Mã thí sinh',
          'Xác nhận',
          'Vòng thi',
          'Mã tham chiếu', 
          'IP Address'
        ];

        console.log(`[GOOGLE_SHEETS] Creating header for sheet: ${sheetName}`);
        await this.sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1:K1`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [headers],
          },
        });
        console.log(`[GOOGLE_SHEETS] ✅ Created header for sheet: ${sheetName}`);
      } else {
        console.log(`[GOOGLE_SHEETS] Header already exists for sheet: ${sheetName}`);
      }
    } catch (error) {
      console.error(`[GOOGLE_SHEETS] ❌ Error ensuring header exists (${sheetName}):`, error);
      throw error;
    }
  }

  private getSheetName(round: string): string {
    const sheetNames = {
      'hop-bao': 'HopBao',
      'so-tuyen': 'SoTuyen',
      'so-khao': 'SoKhao', 
      'ban-ket': 'BanKet',
      'chung-ket': 'ChungKet',
    };
    return sheetNames[round as keyof typeof sheetNames] || 'Unknown';
  }

  private prepareRowData(data: CheckinSubmission, ipAddress?: string): string[] {
    // Convert userType to Vietnamese display text
    const userTypeDisplay = data.userType === 'thi-sinh' ? 'Thí sinh' :
                           data.userType === 'bgk' ? 'Ban giám khảo' :
                           data.userType === 'khan-gia' ? 'Khán giả' : 'Khách mời'
    
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
      userTypeDisplay,
      data.region || '',
      data.contestantId || '',
      data.confirmed ? 'Có' : 'Không',
      data.round,
      data.confirmationCode,
      ipAddress || 'Unknown'
    ];
  }

  async getSheetStats(round: string): Promise<{ total: number; recent: number }> {
    try {
      await this.initializeAuth();
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const sheetName = this.getSheetName(round);
      
      console.log(`[GOOGLE_SHEETS] Getting stats for sheet: ${sheetName}`);
      
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
        } catch {
          // Skip invalid date entries
        }
      }
      
      console.log(`[GOOGLE_SHEETS] Stats for ${sheetName}: ${total} total, ${recent} recent`);
      return { total, recent };
    } catch (error) {
      console.error(`[GOOGLE_SHEETS] ❌ Error getting sheet stats (${round}):`, error);
      return { total: 0, recent: 0 };
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // If not initialized, perform initialization
      if (!this.isInitialized) {
        await this.initializeAuth();
      }
      
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      console.log(`[GOOGLE_SHEETS] Testing connection to spreadsheet: ${spreadsheetId}`);
      
      // Create a promise that will reject after timeout
      const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Connection test timed out after 10 seconds')), 10000);
      });
      
      // Race between the actual API call and the timeout
      const result = await Promise.race([
        this.sheets.spreadsheets.get({ spreadsheetId }),
        timeout
      ]);
      
      console.log(`[GOOGLE_SHEETS] ✅ Connection test successful`);
      console.log(`[GOOGLE_SHEETS] Spreadsheet title: ${result.data.properties?.title}`);
      console.log(`[GOOGLE_SHEETS] Sheet count: ${result.data.sheets?.length}`);
      
      return { 
        success: true, 
        message: `Connection successful. Spreadsheet: "${result.data.properties?.title}" with ${result.data.sheets?.length} sheets.`
      };
    } catch (error) {
      console.error(`[GOOGLE_SHEETS] ❌ Connection test failed:`, error);
      
      // Provide more specific error messages
      let message = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('timed out')) {
          message = 'Connection test timed out. Please check your network connection and try again.';
        } else if (error.message.includes('invalid_grant')) {
          message = 'Authentication failed. Please check your credentials.';
        } else if (error.message.includes('permission')) {
          message = 'Access denied. Please check the spreadsheet permissions.';
        } else {
          message = error.message;
        }
      }
      
      return {
        success: false,
        message
      };
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
