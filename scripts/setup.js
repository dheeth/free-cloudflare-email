#!/usr/bin/env node

/**
 * Initial Setup Script
 * Complete setup for first-time deployment
 * Usage: node scripts/setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function runCommand(cmd, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ ${description} complete`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed`);
    console.error(error.message);
    return false;
  }
}

async function main() {
  console.log('\n═'.repeat(60));
  console.log('🚀 Free Cloudflare Email - Initial Setup');
  console.log('═'.repeat(60));
  console.log('\nThis wizard will guide you through the initial setup.');
  console.log('Make sure you have:');
  console.log('  ✓ Cloudflare account created');
  console.log('  ✓ Domain added to Cloudflare');
  console.log('  ✓ Node.js v18+ installed');
  console.log('  ✓ Ran `npm install`\n');
  
  const proceed = await prompt('Ready to proceed? (yes/no): ');
  if (proceed.toLowerCase() !== 'yes') {
    console.log('❌ Setup cancelled');
    rl.close();
    return;
  }

  try {
    // Step 1: Check if already logged in
    console.log('\n📝 Step 1: Authenticate with Cloudflare');
    console.log('If you see a browser window, complete the authentication');
    runCommand('wrangler login', 'Cloudflare authentication');

    // Step 2: Check wrangler.toml exists
    console.log('\n📝 Step 2: Configure Database');
    if (!fs.existsSync('wrangler.toml')) {
      console.error('❌ wrangler.toml not found');
      rl.close();
      return;
    }

    const dbName = await prompt('\nEnter database name (default: email-system-db): ') || 'email-system-db';
    
    // Create database
    const createDbCmd = `wrangler d1 create ${dbName}`;
    console.log('\n🔧 Creating D1 database...');
    try {
      const output = execSync(createDbCmd, { encoding: 'utf-8' });
      console.log(output);
      
      // Extract database ID
      const idMatch = output.match(/database_id = "([^"]+)"/);
      if (idMatch) {
        console.log(`\n📌 Database ID: ${idMatch[1]}`);
        console.log('\n⚠️  Update your wrangler.toml with:');
        console.log(`\n[[d1_databases]]`);
        console.log(`binding = "DB"`);
        console.log(`database_name = "${dbName}"`);
        console.log(`database_id = "${idMatch[1]}"`);
      }
      
      const updated = await prompt('\nHave you updated wrangler.toml? (yes/no): ');
      if (updated.toLowerCase() !== 'yes') {
        console.log('❌ Please update wrangler.toml and run this script again');
        rl.close();
        return;
      }
    } catch (error) {
      console.error('Error creating database:', error.message);
      rl.close();
      return;
    }

    // Step 3: Run migrations
    console.log('\n📝 Step 3: Initialize Database Schema');
    console.log('Running all migrations...\n');
    
    if (!runCommand('node scripts/run-migrations.js', 'Database migrations')) {
      console.error('\n❌ Migration failed. Please fix the errors above.');
      rl.close();
      return;
    }

    // Step 4: Update admin token
    console.log('\n📝 Step 4: Security Configuration');
    const adminToken = await prompt('\nEnter a strong admin token (or press Enter for random): ');
    
    if (adminToken) {
      const updateCmd = `wrangler d1 execute ${dbName} --remote --command="UPDATE users SET token = '${adminToken}' WHERE id = 'admin'"`;
      if (runCommand(updateCmd, 'Admin token update')) {
        console.log(`\n📌 Admin Token: ${adminToken}`);
        console.log('Save this token in a secure location!');
      }
    }

    // Step 5: Deploy
    console.log('\n📝 Step 5: Deploy to Cloudflare');
    const deploy = await prompt('Deploy to Cloudflare Workers now? (yes/no): ');
    
    if (deploy.toLowerCase() === 'yes') {
      if (!runCommand('wrangler deploy', 'Worker deployment')) {
        console.error('\n❌ Deployment failed');
        rl.close();
        return;
      }
    }

    // Step 6: Email Routing
    console.log('\n📝 Step 6: Configure Email Routing');
    console.log('\n⚠️  Manual Configuration Required:');
    console.log('\n1. Go to: https://dash.cloudflare.com');
    console.log('2. Select your domain');
    console.log('3. Click: Email → Email Routing');
    console.log('4. Enable Email Routing');
    console.log('5. Add Catch-all address:');
    console.log('   - Click Edit on Catch-all');
    console.log('   - Action: Send to a Worker');
    console.log('   - Destination: Select free-cloudflare-email');
    console.log('   - Save');
    
    const emailConfigured = await prompt('\nHave you configured email routing? (yes/no): ');

    // Summary
    console.log('\n═'.repeat(60));
    console.log('✅ Setup Complete!');
    console.log('═'.repeat(60));
    console.log('\n📋 Next Steps:');
    console.log('1. Visit your worker URL');
    console.log('2. Login with admin token');
    console.log('3. Update domain in Settings');
    console.log('\n🧪 Test the system:');
    console.log('1. Register a new user');
    console.log('2. Create an email address');
    console.log('3. Send a test email to it\n');

  } catch (error) {
    console.error('\n❌ Setup error:', error.message);
  }

  rl.close();
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {};
