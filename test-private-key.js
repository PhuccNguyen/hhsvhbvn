import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

function fixPrivateKey() {
  console.log('🔧 Fixing Private Key Format...\n');
  
  let keyContent = '';
  
  // Try to get key content
  if (process.env.GOOGLE_PRIVATE_KEY_B64) {
    try {
      keyContent = Buffer.from(process.env.GOOGLE_PRIVATE_KEY_B64, 'base64').toString('utf8');
      console.log('✅ Got key from GOOGLE_PRIVATE_KEY_B64');
    } catch (error) {
      console.error('❌ Failed to decode base64 key:', error.message);
    }
  } else if (process.env.GOOGLE_PRIVATE_KEY) {
    keyContent = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    console.log('✅ Got key from GOOGLE_PRIVATE_KEY');
  }
  
  if (!keyContent) {
    console.error('❌ No key content found');
    return;
  }
  
  console.log('Original key length:', keyContent.length);
  console.log('Original key lines:', keyContent.split('\n').length);
  
  // Clean and format the key
  try {
    // Remove all whitespace and extract the key body
    const cleanKey = keyContent.replace(/\s+/g, ' ').trim();
    const beginMatch = cleanKey.match(/-----BEGIN PRIVATE KEY-----\s*(.+?)\s*-----END PRIVATE KEY-----/);
    
    if (!beginMatch) {
      throw new Error('Cannot extract key body from content');
    }
    
    const keyBody = beginMatch[1].trim();
    console.log('Key body length:', keyBody.length);
    
    // Format properly with 64-character lines
    const keyLines = keyBody.match(/.{1,64}/g) || [];
    const formattedKey = [
      '-----BEGIN PRIVATE KEY-----',
      ...keyLines,
      '-----END PRIVATE KEY-----'
    ].join('\n');
    
    console.log('\n✅ Formatted Key:');
    console.log('- Lines:', formattedKey.split('\n').length);
    console.log('- Length:', formattedKey.length);
    console.log('- Preview:');
    console.log(formattedKey.substring(0, 100) + '...');
    
    // Save formatted key
    fs.writeFileSync('formatted-private-key.pem', formattedKey);
    console.log('\n💾 Saved formatted key to: formatted-private-key.pem');
    
    // Generate new base64
    const newBase64 = Buffer.from(formattedKey).toString('base64');
    fs.writeFileSync('formatted-private-key.b64', newBase64);
    console.log('💾 Saved base64 key to: formatted-private-key.b64');
    
    console.log('\n📋 Copy this to your .env.local:');
    console.log('GOOGLE_PRIVATE_KEY_B64=' + newBase64);
    
  } catch (error) {
    console.error('❌ Failed to format key:', error.message);
  }
}

fixPrivateKey();
