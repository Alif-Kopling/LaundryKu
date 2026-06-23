const pool = require('../config/database');

async function generateInvoiceNumber() {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM transactions WHERE DATE(created_at) = CURDATE()"
  );

  const seq = String(rows[0].count + 1).padStart(3, '0');
  return `INV-${dateStr}-${seq}`;
}

module.exports = { generateInvoiceNumber };
