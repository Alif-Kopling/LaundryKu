const pool = require('../config/database');
const { generateInvoiceNumber } = require('../utils/invoiceHelper');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, c.name AS customer_name
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
      SELECT t.*, c.name AS customer_name
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
    const { customer_id, service_name, weight, price_per_kg, total_price } = req.body;
    const invoiceNumber = await generateInvoiceNumber();

    const [result] = await pool.query(
      `INSERT INTO transactions (customer_id, invoice_number, service_name, weight, price_per_kg, total_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [customer_id, invoiceNumber, service_name, weight, price_per_kg, total_price]
    );

    res.status(201).json({ id: result.insertId, invoice_number: invoiceNumber });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { service_name, weight, price_per_kg, total_price, status } = req.body;
    const [result] = await pool.query(
      `UPDATE transactions SET service_name = ?, weight = ?, price_per_kg = ?, total_price = ?, status = ?
       WHERE id = ?`,
      [service_name, weight, price_per_kg, total_price, status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction updated' });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM transactions WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatus = ['received', 'processing', 'finished', 'picked_up'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const [result] = await pool.query(
      'UPDATE transactions SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Status updated' });
  } catch (error) {
    next(error);
  }
};
