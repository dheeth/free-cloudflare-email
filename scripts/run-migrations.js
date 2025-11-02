#!/usr/bin/env node

/**
 * Migration Runner
 * Automatically detects and runs pending migrations in order
 * Usage: node scripts/run-migrations.js [database-name] [environment]
 * Examples:
 *   node scripts/run-migrations.js email-system-db          # uses default env
 *   node scripts/run-migrations.js email-system-db --remote # runs on production
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const MIGRATIONS_DIR = path.join(__dirname, '../migrations');
let DB_NAME = process.argv[2] || '';
const ENV = process.argv[3] || '';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

/**
 * Get database name from user or environment
 */
async function getDatabaseName() {
  if (DB_NAME) {
    console.log(`📌 Using database: ${DB_NAME}\n`);
    return DB_NAME;
  }

  try {
    // Try to read from wrangler.toml
    const wranglerPath = path.join(__dirname, '../wrangler.toml');
    if (fs.existsSync(wranglerPath)) {
      const content = fs.readFileSync(wranglerPath, 'utf-8');
      // Simple regex to extract database_name
      const match = content.match(/database_name\s*=\s*['"]([\w-]+)['"]/);
      if (match) {
        const name = match[1];
        console.log(`📌 Found database in wrangler.toml: ${name}\n`);
        return name;
      }
    }
  } catch (error) {
    // Continue to prompt user
  }

  // Prompt user for database name
  console.log('❌ Could not auto-detect database name');
  const dbName = await prompt('📝 Enter your D1 database name: ');
  
  if (!dbName.trim()) {
    console.error('❌ Database name is required');
    process.exit(1);
  }

  console.log(`📌 Using database: ${dbName.trim()}\n`);
  return dbName.trim();
}

/**
 * Get all migration files in order
 */
function getMigrationFiles() {
  return fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Sort alphabetically to maintain order (0001, 0002, etc)
}

/**
 * Get list of already-applied migrations from database
 */
async function getAppliedMigrations(dbName) {
  try {
    const query = "SELECT name FROM migrations ORDER BY applied_at";
    const cmd = `wrangler d1 execute ${dbName} ${ENV} --command="${query}"`;
    
    console.log('📋 Checking applied migrations...');
    const output = execSync(cmd, { encoding: 'utf-8' });
    
    // Parse the JSON output from wrangler
    const lines = output.split('\n').filter(line => line.trim());
    const applied = new Set();
    
    lines.forEach(line => {
      if (line.includes('"name"') || line.includes("'name'")) {
        const match = line.match(/['"]([\w._-]+)['"]/);
        if (match) applied.add(match[1]);
      }
    });
    
    return applied;
  } catch (error) {
    // If migrations table doesn't exist yet, return empty set
    if (error.message.includes('no such table')) {
      console.log('ℹ️  No migrations table found (will be created)');
      return new Set();
    }
    throw error;
  }
}

/**
 * Run a single migration file
 */
function runMigration(filename, dbName) {
  const filepath = path.join(MIGRATIONS_DIR, filename);
  const cmd = `wrangler d1 execute ${dbName} ${ENV} --file="${filepath}"`;
  
  console.log(`⚙️  Running: ${filename}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✅ Success: ${filename}\n`);
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${filename}`);
    console.error(error.message);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔄 Migration Runner\n');
  
  // Get database name from user or wrangler.toml
  const dbName = await getDatabaseName();
  
  const isRemote = ENV.includes('--remote');
  const target = isRemote ? 'Production Database' : 'Local Database';
  console.log(`📍 Target: ${target}`);
  
  if (isRemote) {
    console.log('⚠️  Running migrations on PRODUCTION database\n');
  }
  
  try {
    // Get all migration files
    const migrationFiles = getMigrationFiles();
    
    if (migrationFiles.length === 0) {
      console.log('❌ No migration files found in migrations/ directory');
      rl.close();
      process.exit(1);
    }
    
    console.log(`📦 Found ${migrationFiles.length} migration(s):\n`);
    migrationFiles.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file}`);
    });
    console.log('');
    
    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations(dbName);
    
    // Find pending migrations
    const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.has(file));
    
    if (pendingMigrations.length === 0) {
      console.log('✅ All migrations already applied! Nothing to do.\n');
      console.log('Applied migrations:');
      appliedMigrations.forEach(name => console.log(`  ✓ ${name}`));
      rl.close();
      return;
    }
    
    console.log(`⏳ Found ${pendingMigrations.length} pending migration(s):\n`);
    pendingMigrations.forEach((file, i) => {
      console.log(`  ${i + 1}. ${file}`);
    });
    console.log('');
    
    // Run pending migrations in order
    let successCount = 0;
    for (const migrationFile of pendingMigrations) {
      const success = runMigration(migrationFile, dbName);
      if (success) {
        successCount++;
      } else {
        console.error('\n⛔ Migration failed! Aborting remaining migrations.');
        rl.close();
        process.exit(1);
      }
    }
    
    // Summary
    console.log('═'.repeat(50));
    console.log(`✅ All migrations completed successfully!`);
    console.log(`   ${successCount} migration(s) applied`);
    console.log('═'.repeat(50));
    
    rl.close();
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { getMigrationFiles, getAppliedMigrations, runMigration };
