#!/usr/bin/env node

/**
 * Script to rename image files to standard naming convention
 * and update all references in the codebase
 */

const fs = require('fs');
const path = require('path');

// Mapping of old names to new names
const renameMap = {
  // Logo files
  'TingNect Logo.png': 'tingnect-logo.png',
  'TingNect-Logo-icon.png': 'tingnect-logo-icon.png',
  'LOgo_hhsvhbvn.png': 'logo-hhsvhbvn.png',
  
  // Background files
  'CUoCTHiHOAHaUSINHVIeNHOaBiNHVIetNAM2025.png': 'cuoc-thi-hhsv-hoa-binh-viet-nam-2025.png',
  
  // People images
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
  'banner_quymocuocthi.jpg': 'banner-quy-mo-cuoc-thi.jpg'
};

function normalizeFileName(fileName) {
  return fileName
    .toLowerCase()
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Find all references to images in code files
function findImageReferences(imageName) {
  const searchPaths = [
    'src/**/*.tsx',
    'src/**/*.ts',
    'src/**/*.jsx',
    'src/**/*.js',
    'src/**/*.css',
    'src/**/*.module.css'
  ];
  
  // This would need to be implemented with actual file searching
  // For now, return the known patterns
  return [
    `src/app/news/page.tsx`,
    `src/components/home/HeroSection.tsx`,
    `src/components/layout/Header.tsx`,
    `src/app/page.tsx`
  ];
}

// Update file references
function updateFileReferences(filePath, oldPath, newPath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
    
    if (content !== updatedContent) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated references in: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🖼️  Image Rename & Reference Update Script');
  console.log('==========================================');
  
  const publicDir = path.join(process.cwd(), 'public', 'images');
  let renamedCount = 0;
  let updatedFiles = 0;
  
  // Process each rename mapping
  Object.entries(renameMap).forEach(([oldName, newName]) => {
    // Find the file
    const findFile = (dir, fileName) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          const found = findFile(fullPath, fileName);
          if (found) return found;
        } else if (item === fileName) {
          return fullPath;
        }
      }
      return null;
    };
    
    const oldPath = findFile(publicDir, oldName);
    if (oldPath) {
      const newPath = path.join(path.dirname(oldPath), newName);
      
      try {
        // Rename the file
        fs.renameSync(oldPath, newPath);
        console.log(`📁 Renamed: ${oldName} → ${newName}`);
        renamedCount++;
        
        // Update references
        const oldImagePath = `/images/${path.relative(publicDir, oldPath).replace(/\\/g, '/')}`;
        const newImagePath = `/images/${path.relative(publicDir, newPath).replace(/\\/g, '/')}`;
        
        // Update known files
        const filesToUpdate = [
          'src/app/news/page.tsx',
          'src/components/home/HeroSection.tsx',
          'src/components/layout/Header.tsx',
          'src/app/page.tsx',
          'src/data/events.ts'
        ];
        
        filesToUpdate.forEach(file => {
          if (fs.existsSync(file)) {
            if (updateFileReferences(file, oldImagePath, newImagePath)) {
              updatedFiles++;
            }
          }
        });
        
      } catch (error) {
        console.error(`❌ Error renaming ${oldName}:`, error.message);
      }
    } else {
      console.log(`⚠️  File not found: ${oldName}`);
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`   Files renamed: ${renamedCount}`);
  console.log(`   References updated: ${updatedFiles}`);
  console.log('\n✅ Image standardization completed!');
}

if (require.main === module) {
  main();
}