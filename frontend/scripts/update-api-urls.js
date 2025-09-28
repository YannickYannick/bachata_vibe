#!/usr/bin/env node

/**
 * Script pour remplacer automatiquement les URLs hardcodées par des appels au service API
 * Usage: node scripts/update-api-urls.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const FRONTEND_DIR = path.join(__dirname, '..', 'src');
const PATTERNS = [
  '**/*.js',
  '**/*.jsx',
  '**/*.ts',
  '**/*.tsx'
];

// Patterns de remplacement
const REPLACEMENTS = [
  // URLs hardcodées vers localhost
  {
    pattern: /fetch\s*\(\s*['"`]http:\/\/localhost:8000\/api\/([^'"`]+)['"`]\s*\)/g,
    replacement: (match, endpoint) => `ApiService.get${endpoint.split('/')[0].charAt(0).toUpperCase() + endpoint.split('/')[0].slice(1)}()`
  },
  {
    pattern: /fetch\s*\(\s*['"`]https:\/\/bachatavibe\.com\/api\/([^'"`]+)['"`]\s*\)/g,
    replacement: (match, endpoint) => `ApiService.get${endpoint.split('/')[0].charAt(0).toUpperCase() + endpoint.split('/')[0].slice(1)}()`
  },
  // URLs avec variables
  {
    pattern: /const\s+response\s*=\s*await\s+fetch\s*\(\s*['"`]http:\/\/localhost:8000\/api\/([^'"`]+)['"`]\s*\)/g,
    replacement: (match, endpoint) => `const data = await ApiService.get${endpoint.split('/')[0].charAt(0).toUpperCase() + endpoint.split('/')[0].slice(1)}()`
  },
  {
    pattern: /const\s+response\s*=\s*await\s+fetch\s*\(\s*['"`]https:\/\/bachatavibe\.com\/api\/([^'"`]+)['"`]\s*\)/g,
    replacement: (match, endpoint) => `const data = await ApiService.get${endpoint.split('/')[0].charAt(0).toUpperCase() + endpoint.split('/')[0].slice(1)}()`
  }
];

// Fonction pour traiter un fichier
function processFile(filePath, dryRun = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;

    // Appliquer les remplacements
    REPLACEMENTS.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        newContent = newContent.replace(pattern, replacement);
        hasChanges = true;
      }
    });

    // Ajouter l'import ApiService si nécessaire
    if (hasChanges && !newContent.includes('import ApiService')) {
      const importLine = "import ApiService from '../services/api';\n";
      const lines = newContent.split('\n');
      const lastImportIndex = lines.findLastIndex(line => line.startsWith('import'));
      
      if (lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, importLine);
      } else {
        lines.unshift(importLine);
      }
      
      newContent = lines.join('\n');
    }

    if (hasChanges) {
      if (dryRun) {
        console.log(`[DRY RUN] Would update: ${filePath}`);
        console.log('Changes:');
        console.log('---');
        console.log(newContent);
        console.log('---\n');
      } else {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Fonction principale
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  
  console.log(`🔍 Scanning for files in: ${FRONTEND_DIR}`);
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE UPDATE'}\n`);

  let totalFiles = 0;
  let updatedFiles = 0;

  PATTERNS.forEach(pattern => {
    const files = glob.sync(pattern, { cwd: FRONTEND_DIR });
    
    files.forEach(file => {
      const filePath = path.join(FRONTEND_DIR, file);
      totalFiles++;
      
      if (processFile(filePath, dryRun)) {
        updatedFiles++;
      }
    });
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files ${dryRun ? 'that would be' : ''} updated: ${updatedFiles}`);
  
  if (dryRun) {
    console.log(`\n💡 To apply changes, run: node scripts/update-api-urls.js`);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { processFile, REPLACEMENTS };





