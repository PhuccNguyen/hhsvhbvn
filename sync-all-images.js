#!/usr/bin/env node

/**
 * Comprehensive Image Path Synchronization Script
 * Finds ALL image references and updates them to match renamed files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Complete mapping of ALL renamed files
const completeRenameMap = {
  // Logo files
  'TingNect Logo.png': 'tingnect-logo.png',
  'TingNect-Logo-icon.png': 'tingnect-logo-icon.png',
  'LOgo_hhsvhbvn.png': 'logo-hhsvhbvn.png',
  
  // Background files
  'CUoCTHiHOAHaUSINHVIeNHOaBiNHVIetNAM2025.png': 'cuoc-thi-hhsv-hoa-binh-viet-nam-2025.png',
  
  // People images - ALL of them
  'ChadecuacakhucviettiepcauchuyenHoaBinhNhacSiNguyenVanChung.jpg': 'nhac-si-nguyen-van-chung.jpg',
  'ChadecuacakhucviettiepcauchuyenHoaBinhNhacSiNguyenVanChung_1.jpg': 'nhac-si-nguyen-van-chung-1.jpg',
  'Grand Voin Miss Grand Việt Nam Ngô Thái Ngân.jpg': 'miss-grand-vietnam-ngo-thai-ngan.jpg',
  'Top10MissGrandViệtNamPhamNhưThùy.jpg': 'top10-miss-grand-vietnam-pham-nhu-thuy.jpg',
  'a3MissgrandVietNamdinhYQuyen.jpg': 'miss-grand-vietnam-dinh-y-quyen.jpg',
  'casinguyenduyenquynh.jpg': 'ca-si-nguyen-duyen-quynh.jpg',
  'CasiAnhQuanIdol.jpg': 'ca-si-anh-quan-idol.jpg',
  'MCchuTanVan.jpg': 'mc-chu-tan-van.jpg',
  'hoahauubg.jpg': 'hoa-hau-ubg.jpg',
  'namvuong.jpg': 'nam-vuong.jpg',
  
  // Banner files
  'banner_quymocuocthi.jpg': 'banner-quy-mo-cuoc-thi.jpg',
  'banner_hero.png': 'hhsv-hero-1.jpg'
};

// Find all source files that might contain image references
function getAllSourceFiles() {
  const patterns = [
    'src/**/*.tsx',
    'src/**/*.ts', 
    'src/**/*.jsx',
    'src/**/*.js',
    'src/**/*.css',
    'src/**/*.module.css',
    'src/**/*.scss',
    'components.json',
    'next.config.ts',
    'tailwind.config.js'
  ];
  
  let allFiles = [];
  patterns.forEach(pattern => {
    try {
      const files = glob.sync(pattern, { cwd: process.cwd() });
      allFiles = allFiles.concat(files);
    } catch (error) {
      console.warn(`Pattern ${pattern} failed:`, error.message);
    }
  });
  
  return [...new Set(allFiles)]; // Remove duplicates
}

// Update all references in a file
function updateFileReferences(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    let changeCount = 0;
    
    // Check each renamed file
    Object.entries(completeRenameMap).forEach(([oldName, newName]) => {
      // Multiple possible path formats
      const possibleOldPaths = [
        `/images/logo/${oldName}`,
        `/images/background/${oldName}`,
        `/images/nguoinoitieng/${oldName}`,
        `/images/banner/${oldName}`,
        `/images/hero/${oldName}`,
        `/images/news/${oldName}`,
        `/images/checkin/${oldName}`,
        `/images/timeline/${oldName}`,
        `images/logo/${oldName}`,
        `images/background/${oldName}`,
        `images/nguoinoitieng/${oldName}`,
        `images/banner/${oldName}`,
        `images/hero/${oldName}`,
        `images/news/${oldName}`,
        `images/checkin/${oldName}`,
        `images/timeline/${oldName}`,
        `./images/logo/${oldName}`,
        `./images/background/${oldName}`,
        `./images/nguoinoitieng/${oldName}`,
        `./images/banner/${oldName}`,
        `./images/hero/${oldName}`,
        `./images/news/${oldName}`,
        `./images/checkin/${oldName}`,
        `./images/timeline/${oldName}`,
        `public/images/logo/${oldName}`,
        `public/images/background/${oldName}`,
        `public/images/nguoinoitieng/${oldName}`,
        `public/images/banner/${oldName}`,
        `public/images/hero/${oldName}`,
        `public/images/news/${oldName}`,
        `public/images/checkin/${oldName}`,
        `public/images/timeline/${oldName}`
      ];
      
      possibleOldPaths.forEach(oldPath => {
        if (content.includes(oldPath)) {
          // Determine the correct new path based on the old path structure
          let newPath = oldPath.replace(oldName, newName);
          
          // Special handling for specific renames
          if (oldName === 'banner_hero.png') {
            newPath = oldPath.replace('banner_hero.png', 'hhsv-hero-1.jpg');
          }
          
          const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          const newContent = content.replace(regex, newPath);
          
          if (content !== newContent) {
            content = newContent;
            hasChanges = true;
            changeCount++;
          }
        }
      });
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${changeCount} references in: ${filePath}`);
      return changeCount;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return 0;
  }
}

// Main function
function main() {
  console.log('🔄 Comprehensive Image Path Synchronization');
  console.log('===========================================');
  
  const sourceFiles = getAllSourceFiles();
  console.log(`📁 Found ${sourceFiles.length} source files to check`);
  
  let totalUpdates = 0;
  let updatedFiles = 0;
  
  sourceFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const updates = updateFileReferences(file);
      if (updates > 0) {
        totalUpdates += updates;
        updatedFiles++;
      }
    }
  });
  
  console.log('\n📊 Synchronization Summary:');
  console.log(`   Files checked: ${sourceFiles.length}`);
  console.log(`   Files updated: ${updatedFiles}`);
  console.log(`   Total path updates: ${totalUpdates}`);
  
  if (totalUpdates > 0) {
    console.log('\n✅ All image paths have been synchronized!');
    console.log('🔧 Rebuild your Docker container to apply changes:');
    console.log('   cd docker && docker-compose build hhsvhbvn-app && docker-compose up -d');
  } else {
    console.log('\n✅ All image paths are already synchronized!');
  }
}

// Add glob dependency check
try {
  require('glob');
} catch (error) {
  console.error('❌ Missing dependency: glob');
  console.log('Please install it with: npm install glob');
  process.exit(1);
}

if (require.main === module) {
  main();
}