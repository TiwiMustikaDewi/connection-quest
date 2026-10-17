// Standalone Node.js script to test PostgreSQL / Supabase Real-Time connection
// Run: node test-db.mjs

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Parse .env manually
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = trimmed.split('=')[1]?.trim();
    }
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseKey = trimmed.split('=')[1]?.trim();
    }
  }
} catch {
  // ignore
}

console.log('\n======================================================');
console.log('  🔍 CONNECTION QUEST - POSTGRESQL CONNECTIVITY CHECK');
console.log('======================================================\n');
console.log(`URL : ${supabaseUrl || '(kosong / not configured)'}`);
console.log(`KEY : ${supabaseKey ? supabaseKey.slice(0, 16) + '...' : '(kosong / not configured)'}\n`);

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.log('⚠️  Kredensial belum diisi di file .env');
  console.log('👉 Masukkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env atau via menu Leaderboard di browser.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTest() {
  console.log('⏳ Menghubungi PostgreSQL...');
  const start = Date.now();

  try {
    const { count, error } = await supabase
      .from('submissions')
      .select('id', { count: 'exact', head: true });

    const latency = Date.now() - start;

    if (error) {
      if (error.code === '42P01') {
        console.log(`❌ Tabel "submissions" belum ada di PostgreSQL!`);
        console.log(`👉 Buka Supabase SQL Editor dan jalankan file: supabase/schema.sql`);
      } else {
        console.log(`❌ Error query database: ${error.message}`);
      }
      process.exit(1);
    }

    console.log(`✅ BERHASIL TERHUBUNG KE POSTGRESQL!`);
    console.log(`⏱️  Latency Ping : ${latency}ms`);
    console.log(`📊 Data Terkumpul: ${count} submission di tabel public.submissions\n`);
  } catch (err) {
    console.log(`❌ Gagal terhubung ke host: ${err.message}`);
    process.exit(1);
  }
}

runTest();
