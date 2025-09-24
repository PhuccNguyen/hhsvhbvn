// Debug utility for Google Sheets
async function debugGoogleSheets() {
  console.log('\n🔍 Starting Google Sheets Debug\n');
  
  // 1. Check environment variables
  const vars = {
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
    GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
    HAS_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
    HAS_PRIVATE_KEY_B64: !!process.env.GOOGLE_PRIVATE_KEY_B64
  };
  
  console.log('Environment Variables:');
  Object.entries(vars).forEach(([key, value]) => {
    console.log(`${key}: ${value === true ? '✅ Present' : value === false ? '❌ Missing' : value}`);
  });
  
  // 2. Try to get spreadsheet info
  try {
    const { google } = require('googleapis');
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    console.log('\nCreating auth client...');
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    console.log('Getting access token...');
    const token = await auth.getAccessToken();
    console.log('✅ Got access token');
    
    console.log('\nTesting spreadsheet access...');
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      fields: '*'
    });
    
    console.log('\nSpreadsheet Info:');
    console.log('- Title:', response.data.properties.title);
    console.log('- Sheets:', response.data.sheets.map(s => s.properties.title).join(', '));
    console.log('✅ Successfully accessed spreadsheet\n');
    
  } catch (error) {
    console.error('\n❌ Error during debug:', error);
    if (error.response) {
      console.error('API Error Details:', {
        status: error.response.status,
        message: error.response.data.error.message,
        errors: error.response.data.error.errors
      });
    }
  }
}

// Export for use in scripts
module.exports = { debugGoogleSheets };