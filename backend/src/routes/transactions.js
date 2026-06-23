const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticate = require('../middlewares/auth');

router.use(authenticate);

/**
 * @swagger
 * /transactions:
 *   get:
 *     tags: [Transactions]
 *     summary: Get all transactions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/', transactionController.getAll);

/**
 * @swagger
 * /transactions/history:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction history with filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered transaction list
 */
router.get('/history', transactionController.getHistory);

/**
 * @swagger
 * /transactions/dashboard/stats:
 *   get:
 *     tags: [Transactions]
 *     summary: Get dashboard statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get('/dashboard/stats', transactionController.getDashboardStats);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction by ID
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
 *         description: Transaction detail
 */
router.get('/:id', transactionController.getById);

/**
 * @swagger
 * /transactions/{id}/invoice:
 *   get:
 *     tags: [Transactions]
 *     summary: Get transaction invoice
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
 *         description: Invoice data
 */
router.get('/:id/invoice', transactionController.getInvoice);

/**
 * @swagger
 * /transactions:
 *   post:
 *     tags: [Transactions]
 *     summary: Create a new transaction
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               weight:
 *                 type: number
 *               price_per_kg:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post('/', transactionController.create);

/**
 * @swagger
 * /transactions/{id}/status:
 *   patch:
 *     tags: [Transactions]
 *     summary: Update transaction status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [received, processing, finished, picked_up]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch('/:id/status', transactionController.updateStatus);

module.exports = router;
