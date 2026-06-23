const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authenticate = require('../middlewares/auth');

router.use(authenticate);

/**
 * @swagger
 * /transactions/{id}/invoice:
 *   get:
 *     tags: [Invoice]
 *     summary: Get invoice detail
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Invoice detail
 */
router.get('/', invoiceController.getInvoice);

/**
 * @swagger
 * /transactions/{id}/invoice/pdf:
 *   get:
 *     tags: [Invoice]
 *     summary: Download invoice PDF
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file
 */
router.get('/pdf', invoiceController.downloadPdf);

module.exports = router;
