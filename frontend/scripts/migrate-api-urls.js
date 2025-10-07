#!/usr/bin/env node

/**
 * Script de migration des URLs hardcodées vers le service API
 * Usage: node scripts/migrate-api-urls.js [--dry-run]
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

// Patterns de remplacement plus complets
const REPLACEMENTS = [
  // URLs de base
  {
    pattern: /http:\/\/localhost:8000\/api\//g,
    replacement: 'API_BASE_URL + "/'
  },
  {
    pattern: /https:\/\/bachatavibe\.com\/api\//g,
    replacement: 'API_BASE_URL + "/'
  },
  // Patterns spécifiques pour les méthodes
  {
    pattern: /const\s+response\s*=\s*await\s+fetch\s*\(\s*`http:\/\/localhost:8000\/api\/([^`]+)`/g,
    replacement: 'const data = await ApiService.get${getMethodName("$1")}()'
  },
  {
    pattern: /const\s+response\s*=\s*await\s+fetch\s*\(\s*`https:\/\/bachatavibe\.com\/api\/([^`]+)`/g,
    replacement: 'const data = await ApiService.get${getMethodName("$1")}()'
  },
  // Patterns avec variables
  {
    pattern: /fetch\s*\(\s*`http:\/\/localhost:8000\/api\/([^`]+)`/g,
    replacement: 'ApiService.get${getMethodName("$1")}()'
  },
  {
    pattern: /fetch\s*\(\s*`https:\/\/bachatavibe\.com\/api\/([^`]+)`/g,
    replacement: 'ApiService.get${getMethodName("$1")}()'
  }
];

// Fonction pour convertir l'endpoint en nom de méthode
function getMethodName(endpoint) {
  const parts = endpoint.split('/');
  const resource = parts[0];
  
  // Mapping des ressources vers les méthodes
  const methodMap = {
    'competitions': 'Competitions',
    'events': 'Events', 
    'courses': 'Courses',
    'festivals': 'Festivals',
    'formations': 'Formations',
    'auth': 'Auth',
    'accounts': 'Accounts',
    'stats': 'Stats'
  };
  
  return methodMap[resource] || resource.charAt(0).toUpperCase() + resource.slice(1);
}

// Fonction pour traiter un fichier
function processFile(filePath, dryRun = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    let hasChanges = false;
    let changes = [];

    // Vérifier s'il y a des URLs hardcodées
    const hasHardcodedUrls = content.includes('http://localhost:8000') || content.includes('https://bachatavibe.com');
    
    if (!hasHardcodedUrls) {
      return false;
    }

    // Appliquer les remplacements
    REPLACEMENTS.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        newContent = newContent.replace(pattern, replacement);
        hasChanges = true;
        changes.push(`Replaced ${matches.length} occurrences`);
      }
    });

    // Ajouter l'import ApiService si nécessaire
    if (hasChanges && !newContent.includes('import ApiService')) {
      const importLine = "import ApiService from '../services/api';\n";
      const lines = newContent.split('\n');
      
      // Trouver la dernière ligne d'import
      let lastImportIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      
      if (lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, importLine);
      } else {
        lines.unshift(importLine);
      }
      
      newContent = lines.join('\n');
      changes.push('Added ApiService import');
    }

    if (hasChanges) {
      if (dryRun) {
        console.log(`[DRY RUN] Would update: ${filePath}`);
        console.log('Changes:', changes.join(', '));
        console.log('---');
        console.log(newContent);
        console.log('---\n');
      } else {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
        console.log(`   Changes: ${changes.join(', ')}`);
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
    console.log(`\n💡 To apply changes, run: node scripts/migrate-api-urls.js`);
  } else {
    console.log(`\n🎉 Migration completed!`);
  }
}

// Exécuter le script
if (require.main === module) {
  main();
}

module.exports = { processFile, REPLACEMENTS };








