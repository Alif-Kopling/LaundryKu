const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, c.name AS customer_name, c.phone AS customer_phone
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      ORDER BY t.created_at DESC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, c.name AS customer_name, c.phone AS customer_phone
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      WHERE t.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { customer_id, weight, price_per_kg, notes } = req.body;
    if (!customer_id || !weight || !price_per_kg) {
      return res.status(400).json({ message: 'customer_id, weight, and price_per_kg are required' });
    }

    const total_price = weight * price_per_kg;

    const [countResult] = await pool.query('SELECT COUNT(*) AS total FROM transactions');
    const invoiceNumber = `LND-${String(countResult[0].total + 1).padStart(4, '0')}`;

    const [result] = await pool.query(
      `INSERT INTO transactions (customer_id, invoice_number, service_name, weight, price_per_kg, total_price, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, invoiceNumber, 'Cuci Kering', weight, price_per_kg, total_price, notes || '']
    );

    res.status(201).json({
      id: result.insertId,
      invoice_number: invoiceNumber,
      customer_id,
      weight,
      price_per_kg,
      total_price,
      notes: notes || '',
      status: 'received'
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['received', 'processing', 'finished', 'picked_up'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const [result] = await pool.query(
      'UPDATE transactions SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Status updated', status });
  } catch (error) {
    next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, c.name AS customer_name, c.phone AS customer_phone, c.address AS customer_address
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      WHERE t.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { search, start_date, end_date } = req.query;

    let query = `
      SELECT t.*, c.name AS customer_name, c.phone AS customer_phone
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
    `;
    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(t.invoice_number LIKE ? OR c.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    if (start_date) {
      conditions.push('t.created_at >= ?');
      params.push(start_date);
    }

    if (end_date) {
      conditions.push('t.created_at <= ?');
      params.push(`${end_date} 23:59:59`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY t.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [customerCount] = await pool.query('SELECT COUNT(*) AS total FROM customers');
    const [activeTransactions] = await pool.query("SELECT COUNT(*) AS total FROM transactions WHERE status != 'picked_up'");

    const [completedToday] = await pool.query(`
      SELECT COUNT(*) AS total FROM transactions
      WHERE status = 'picked_up' AND DATE(updated_at) = CURDATE()
    `);

    const [pendingPickup] = await pool.query("SELECT COUNT(*) AS total FROM transactions WHERE status = 'finished'");

    const [recentTransactions] = await pool.query(`
      SELECT t.*, c.name AS customer_name, c.phone AS customer_phone
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      ORDER BY t.created_at DESC
      LIMIT 7
    `);

    res.json({
      stats: {
        total_customers: customerCount[0].total,
        active_transactions: activeTransactions[0].total,
        completed_today: completedToday[0].total,
        pending_pickup: pendingPickup[0].total,
      },
      recent_transactions: recentTransactions
    });
  } catch (error) {
    next(error);
  }
};
