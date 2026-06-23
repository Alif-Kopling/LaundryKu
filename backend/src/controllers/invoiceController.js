const pool = require('../config/database');
const PDFDocument = require('pdfkit');

exports.getInvoice = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.invoice_number, c.name AS customer_name, t.service_name,
             t.weight, t.total_price, t.status
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

exports.downloadPdf = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.invoice_number, c.name AS customer_name, t.service_name,
             t.weight, t.price_per_kg, t.total_price, t.status, t.created_at
      FROM transactions t
      JOIN customers c ON t.customer_id = c.id
      WHERE t.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const data = rows[0];

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${data.invoice_number}.pdf`);

    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text('NOTA LAUNDRY', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice: ${data.invoice_number}`);
    doc.text(`Tanggal: ${new Date(data.created_at).toLocaleDateString('id-ID')}`);
    doc.text(`Pelanggan: ${data.customer_name}`);
    doc.moveDown();
    doc.text(`Layanan: ${data.service_name}`);
    doc.text(`Berat: ${data.weight} kg`);
    doc.text(`Harga/kg: Rp ${Number(data.price_per_kg).toLocaleString('id-ID')}`);
    doc.text(`Total: Rp ${Number(data.total_price).toLocaleString('id-ID')}`);
    doc.text(`Status: ${data.status}`);
    doc.moveDown();
    doc.fontSize(10).text('Terima kasih telah menggunakan layanan kami!', { align: 'center' });

    doc.end();
  } catch (error) {
    next(error);
  }
};
