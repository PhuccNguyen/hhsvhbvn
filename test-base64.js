#!/usr/bin/env node

/**
 * Test script for Base64 encoding/decoding of Google Sheets private key
 * Usage: node test-base64.js [path-to-key-file]
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';

function testBase64Conversion(keyContent) {
    console.log('🔧 Testing Base64 Conversion');
    console.log('============================');
    
    try {
        // Test encoding
        console.log('\n1. Original key preview:');
        console.log('   Length:', keyContent.length, 'characters');
        console.log('   First 50 chars:', keyContent.substring(0, 50) + '...');
        console.log('   Last 50 chars:', '...' + keyContent.substring(keyContent.length - 50));
        
        // Encode to base64
        const base64Encoded = Buffer.from(keyContent, 'utf8').toString('base64');
        console.log('\n2. Base64 encoded:');
        console.log('   Length:', base64Encoded.length, 'characters');
        console.log('   First 50 chars:', base64Encoded.substring(0, 50) + '...');
        console.log('   Last 50 chars:', '...' + base64Encoded.substring(base64Encoded.length - 50));
        
        // Test decoding
        const decoded = Buffer.from(base64Encoded, 'base64').toString('utf8');
        console.log('\n3. Decoded back:');
        console.log('   Length:', decoded.length, 'characters');
        console.log('   Matches original:', decoded === keyContent ? '✅ YES' : '❌ NO');
        
        // Test key format
        const isValidKey = decoded.includes('-----BEGIN PRIVATE KEY-----') && 
                          decoded.includes('-----END PRIVATE KEY-----');
        console.log('   Valid key format:', isValidKey ? '✅ YES' : '❌ NO');
        
        if (isValidKey) {
            console.log('\n4. Key validation:');
            const lines = decoded.split('\n').filter(line => line.trim());
            console.log('   Number of lines:', lines.length);
            console.log('   Header present:', lines[0].includes('BEGIN PRIVATE KEY') ? '✅' : '❌');
            console.log('   Footer present:', lines[lines.length - 1].includes('END PRIVATE KEY') ? '✅' : '❌');
            
            // Count base64 content lines (exclude header/footer)
            const contentLines = lines.slice(1, -1);
            console.log('   Content lines:', contentLines.length);
            console.log('   Each line ~64 chars:', contentLines.every(line => line.length <= 65) ? '✅' : '❌');
        }
        
        console.log('\n5. Environment variable format:');
        console.log('   Add this to your .env.local:');
        console.log('   GOOGLE_PRIVATE_KEY_B64=' + base64Encoded);
        
        return {
            success: true,
            base64: base64Encoded,
            decoded: decoded,
            isValid: isValidKey
        };
        
    } catch (error) {
        console.error('\n❌ Error during conversion:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node test-base64.js [path-to-key-file]');
        console.log('');
        console.log('Examples:');
        console.log('  node test-base64.js key.pem');
        console.log('  node test-base64.js ../key.json');
        console.log('Or you can paste your private key content when prompted...');
        console.log('');
        
        // Interactive mode
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        console.log('Please paste your private key content (press Ctrl+D when done):');
        let keyContent = '';
        
        rl.on('line', (line) => {
            keyContent += line + '\n';
        });
        
        rl.on('close', () => {
            if (keyContent.trim()) {
                testBase64Conversion(keyContent.trim());
            } else {
                console.log('No key content provided.');
            }
        });
        
        return;
    }
    
    const keyFilePath = args[0];
    
    try {
        if (!fs.existsSync(keyFilePath)) {
            console.error(`❌ File not found: ${keyFilePath}`);
            process.exit(1);
        }
        
        const keyContent = fs.readFileSync(keyFilePath, 'utf8');
        const result = testBase64Conversion(keyContent);
        
        if (result.success) {
            console.log('\n✅ Test completed successfully!');
            
            // Save result to file
            const outputPath = 'base64-result.txt';
            fs.writeFileSync(outputPath, `# Base64 encoded private key
# Generated: ${new Date().toISOString()}
# Original file: ${keyFilePath}

GOOGLE_PRIVATE_KEY_B64=${result.base64}

# To use in your .env.local file:
# 1. Copy the GOOGLE_PRIVATE_KEY_B64 line above
# 2. Paste it into your .env.local file
# 3. Make sure no other GOOGLE_PRIVATE_KEY is set
`);
            console.log(`📁 Result saved to: ${outputPath}`);
        } else {
            console.log('\n❌ Test failed!');
            process.exit(1);
        }
        
    } catch (error) {
        console.error(`❌ Error reading file: ${error.message}`);
        process.exit(1);
    }
}

main();