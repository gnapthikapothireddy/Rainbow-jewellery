const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  exportSalesExcel,
  exportSalesPDF
} = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);
router.get('/export/excel', protect, adminOnly, exportSalesExcel);
router.get('/export/pdf', protect, adminOnly, exportSalesPDF);

module.exports = router;
