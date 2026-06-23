const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'laundry_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await pool.query(`
      INSERT INTO users (name, email, password, role) VALUES
      ('Admin Laundry', 'admin@laundry.com', ?, 'owner'),
      ('Rina', 'rina@laundry.com', ?, 'karyawan')
    `, [hashedPassword, hashedPassword]);

    await pool.query(`
      INSERT INTO customers (name, phone, address) VALUES
      ('Budi Santoso', '081234567890', 'Jl. Merpati No. 10, Jakarta'),
      ('Siti Nurhaliza', '082345678901', 'Jl. Kenanga No. 25, Jakarta'),
      ('Ahmad Rizki', '083456789012', 'Perumahan Griya Asri Blok C5, Bekasi'),
      ('Dewi Lestari', '084567890123', 'Jl. Mawar No. 7, Depok'),
      ('Rudi Haryanto', '085678901234', 'Jl. Anggrek No. 15, Tangerang')
    `);

    const [customers] = await pool.query('SELECT id FROM customers');

    await pool.query(`
      INSERT INTO transactions (customer_id, invoice_number, service_name, weight, price_per_kg, total_price, status, notes, created_at) VALUES
      (?, 'LND-0001', 'Cuci Kering', 3.5, 8000, 28000, 'processing', 'Celana kerja, hati-hati', NOW() - INTERVAL 5 DAY),
      (?, 'LND-0002', 'Cuci Kering', 2.0, 8000, 16000, 'picked_up', '', NOW() - INTERVAL 4 DAY),
      (?, 'LND-0003', 'Cuci Kering', 5.0, 8000, 40000, 'finished', 'Jas hujan dipisah', NOW() - INTERVAL 3 DAY),
      (?, 'LND-0004', 'Cuci Kering', 1.5, 8000, 12000, 'received', '', NOW() - INTERVAL 2 DAY),
      (?, 'LND-0005', 'Cuci Kering', 4.0, 8000, 32000, 'processing', 'Seprei 2 set', NOW() - INTERVAL 1 DAY),
      (?, 'LND-0006', 'Cuci Kering', 3.0, 8000, 24000, 'finished', '', NOW()),
      (?, 'LND-0007', 'Cuci Kering', 6.0, 8000, 48000, 'received', 'Boneka besar 1 pcs', NOW()),
      (?, 'LND-0008', 'Cuci Kering', 2.5, 8000, 20000, 'processing', '', NOW())
    `, (() => { const ids = customers.map(c => c.id); return Array.from({ length: 8 }, (_, i) => ids[i % ids.length]); })());

    console.log('Seed data berhasil ditambahkan!');
    console.log('Login: admin@laundry.com / admin123');
  } catch (error) {
    console.error('Seed gagal:', error.message);
  } finally {
    await pool.end();
  }
}

seed();
