import fs from 'fs';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testGoogleAuth() {
  console.log('🔑 Testing Google Service Account Authentication');
  console.log('============================================');

  try {
    // Get environment variables
    const requiredVars = {
      GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    };

    // Check for missing variables
    const missingVars = Object.entries(requiredVars)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Missing required variables: ${missingVars.join(', ')}`);
    }

    // Get private key
    let privateKey = null;

    if (process.env.GOOGLE_PRIVATE_KEY_B64) {
      try {
        console.log('\n📝 Decoding base64 private key...');
        privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_B64, 'base64').toString('utf8');
        console.log('✅ Successfully decoded base64 key');
      } catch (error) {
        console.warn('⚠️ Failed to decode base64 key:', error.message);
      }
    }

    if (!privateKey && process.env.GOOGLE_PRIVATE_KEY) {
      console.log('\n📝 Using plain text private key...');
      privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
      console.log('✅ Successfully processed plain text key');
    }

    if (!privateKey) {
      throw new Error('No valid private key found');
    }

    // Save formatted key for inspection
    fs.writeFileSync('temp-key.pem', privateKey);
    console.log('\n💾 Saved formatted key to temp-key.pem for inspection');

    // Initialize auth
    console.log('\n🔐 Creating JWT client...');
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Test auth
    console.log('🔄 Testing authentication...');
    const token = await auth.getAccessToken();
    console.log('✅ Successfully obtained access token');

    // Test sheets API
    console.log('\n📊 Testing Google Sheets API...');
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      fields: 'properties.title,sheets.properties.title'
    });

    console.log('✅ Successfully connected to spreadsheet:');
    console.log('   Title:', response.data.properties?.title);
    console.log('   Sheets:', response.data.sheets?.map(s => s.properties?.title).join(', '));

    // Test write permission
    console.log('\n✍️ Testing write permission...');
    const testSheet = response.data.sheets?.[0].properties?.title;
    if (testSheet) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${testSheet}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Test write ' + new Date().toISOString()]]
        }
      });
      console.log('✅ Successfully wrote test data');
    }

    console.log('\n🎉 All tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    if (error.response) {
      console.error('API Error Details:', {
        status: error.response.status,
        message: error.response.data.error.message,
        errors: error.response.data.error.errors
      });
    }
  } finally {
    // Clean up
    try {
      fs.unlinkSync('temp-key.pem');
    } catch {}
  }
}

testGoogleAuth();