const pool = require('../config/database');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM customers WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const [result] = await pool.query(
      'INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)',
      [name, phone, address]
    );
    res.status(201).json({ id: result.insertId, name, phone, address });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const [result] = await pool.query(
      'UPDATE customers SET name = ?, phone = ?, address = ? WHERE id = ?',
      [name, phone, address, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer updated' });
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM customers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    next(error);
  }
};
