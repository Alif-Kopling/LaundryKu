const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authenticate = require('../middlewares/auth');

router.use(authenticate);

/**
 * @swagger
 * /history:
 *   get:
 *     tags: [History]
 *     summary: Get transaction history with optional filters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter start date (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter end date (YYYY-MM-DD)
 *       - in: query
 *         name: customer_name
 *         schema:
 *           type: string
 *         description: Filter by customer name
 *     responses:
 *       200:
 *         description: List of transaction history
 */
router.get('/', historyController.getAll);

module.exports = router;
