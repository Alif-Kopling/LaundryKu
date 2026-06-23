const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticate = require('../middlewares/auth');

router.use(authenticate);

router.get('/', transactionController.getAll);
router.get('/history', transactionController.getHistory);
router.get('/dashboard/stats', transactionController.getDashboardStats);
router.get('/:id', transactionController.getById);
router.get('/:id/invoice', transactionController.getInvoice);
router.post('/', transactionController.create);
router.patch('/:id/status', transactionController.updateStatus);

module.exports = router;
