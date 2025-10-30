#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🎯 VectorPlay CLI

Usage:
  npx vectorplay@latest create <directory>  Create a new VectorPlay project
  npx vectorplay@latest create .           Create project in current directory

Examples:
  npx vectorplay@latest create my-vector-app
  npx vectorplay@latest create .
  `);
  process.exit(0);
}

const command = args[0];
const targetDir = args[1] || '.';

if (command !== 'create') {
  console.error('Unknown command. Use "create" to create a new project.');
  process.exit(1);
}

function copyTemplate() {
  const templateDir = path.join(__dirname, '..', 'templates');
  const targetPath = path.resolve(targetDir);
  
  // Ensure target directory exists
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  
  // Check if directory is empty (allow only .git and .gitignore)
  const existingFiles = fs.readdirSync(targetPath);
  const nonGitFiles = existingFiles.filter(file => !file.startsWith('.git'));
  
  if (nonGitFiles.length > 0 && targetDir !== '.') {
    console.error(`Directory ${targetDir} is not empty. Please choose an empty directory.`);
    process.exit(1);
  }
  
  // Copy template files
  try {
    console.log(' Creating VectorPlay project...');
    
    const templateFiles = [
      'index.html',
      'main.js',
      'package.json'
    ];
    
    templateFiles.forEach(file => {
      const sourcePath = path.join(templateDir, file);
      const destPath = path.join(targetPath, file);
      
      if (fs.existsSync(sourcePath)) {
        // If target file exists and we're in current directory, ask user
        if (fs.existsSync(destPath) && targetDir === '.') {
          console.log(`  ${file} already exists, skipping...`);
          return;
        }
        
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Created ${file}`);
      }
    });
    
    // Install dependencies automatically
    console.log('\n📦 Installing dependencies...');
    try {
      execSync('npm install', { 
        cwd: targetPath, 
        stdio: 'inherit' 
      });
      console.log('✅ Dependencies installed successfully!');
    } catch (error) {
      console.log('⚠️  Failed to install dependencies automatically.');
      console.log('Please run "npm install" manually.');
    }
    
    console.log(`
🎉 VectorPlay project created successfully!

Next steps:
  ${targetDir !== '.' ? `cd ${targetDir}` : ''}
  npm run dev

Open http://localhost:5173 in your browser to see your VectorPlay app!
    `);
    
  } catch (error) {
    console.error('Error creating project:', error.message);
    process.exit(1);
  }
}

copyTemplate();