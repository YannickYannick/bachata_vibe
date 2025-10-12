#!/usr/bin/env node

/**
 * Script simple de migration des URLs hardcodées
 * Usage: node scripts/simple-migrate.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const FRONTEND_DIR = path.join(__dirname, '..', 'src');

// Trouver tous les fichiers avec des URLs hardcodées
const files = glob.sync('**/*.{js,jsx,ts,tsx}', { cwd: FRONTEND_DIR });

console.log('🔍 Fichiers avec des URLs hardcodées:');
console.log('=====================================');

files.forEach(file => {
  const filePath = path.join(FRONTEND_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('http://localhost:8000') || content.includes('https://bachatavibe.com')) {
    console.log(`📄 ${file}`);
    
    // Compter les occurrences
    const localhostCount = (content.match(/http:\/\/localhost:8000/g) || []).length;
    const productionCount = (content.match(/https:\/\/bachatavibe\.com/g) || []).length;
    
    console.log(`   - localhost:8000: ${localhostCount} occurrences`);
    console.log(`   - bachatavibe.com: ${productionCount} occurrences`);
    console.log('');
  }
});

console.log('💡 Pour migrer manuellement:');
console.log('1. Ajoutez: import ApiService from "../services/api";');
console.log('2. Remplacez: fetch("http://localhost:8000/api/...") par ApiService.get...()');
console.log('3. Supprimez les variables response et les vérifications response.ok');











