const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const { start_date, end_date, customer_name } = req.query;

    let query = `
      SELECT t.*, c.name AS customer_name
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (start_date && end_date) {
      query += ' AND t.created_at BETWEEN ? AND ?';
      params.push(start_date, end_date);
    }

    if (customer_name) {
      query += ' AND c.name LIKE ?';
      params.push(`%${customer_name}%`);
    }

    query += ' ORDER BY t.created_at DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
