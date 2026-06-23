const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { search, start_date, end_date } = req.query;

    let query = `
      SELECT t.*, c.name AS customer_name, c.phone AS customer_phone
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (t.invoice_number LIKE ? OR c.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (start_date) {
      query += ' AND t.created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      query += ' AND t.created_at <= ?';
      params.push(`${end_date} 23:59:59`);
    }

    query += ' ORDER BY t.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
