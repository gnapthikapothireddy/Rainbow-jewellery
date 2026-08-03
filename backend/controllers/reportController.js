const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard-stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalSalesCount = await Order.count({ where: { paymentStatus: 'Paid' } });
    const totalRevenue = await Order.sum('totalAmount', { where: { paymentStatus: 'Paid' } }) || 0.00;
    const totalCustomers = await User.count({ where: { role: 'customer' } });
    const totalOrdersCount = await Order.count();
    
    // Low stock products warning count
    const lowStockCount = await Product.count({ where: { stock: { [Op.lt]: 5 } } });
    const outOfStockCount = await Product.count({ where: { stock: 0 } });

    // Appointments count
    const pendingAppointments = await Appointment.count({ where: { status: 'Pending' } });
    const totalAppointments = await Appointment.count();

    // Latest reviews
    const latestReviews = await Review.findAll({
      limit: 5,
      include: [
        { model: Product, attributes: ['name'] },
        { model: User, attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Recent orders
    const recentOrders = await Order.findAll({
      limit: 5,
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    // Sales by status
    const confirmedCount = await Order.count({ where: { orderStatus: 'Confirmed' } });
    const packedCount = await Order.count({ where: { orderStatus: 'Packed' } });
    const shippedCount = await Order.count({ where: { orderStatus: 'Shipped' } });
    const deliveredCount = await Order.count({ where: { orderStatus: 'Delivered' } });
    const cancelledCount = await Order.count({ where: { orderStatus: 'Cancelled' } });

    res.json({
      success: true,
      data: {
        totalSalesCount,
        totalRevenue: parseFloat(totalRevenue),
        totalCustomers,
        totalOrdersCount,
        lowStockCount,
        outOfStockCount,
        pendingAppointments,
        totalAppointments,
        latestReviews,
        recentOrders,
        salesByStatus: {
          Confirmed: confirmedCount,
          Packed: packedCount,
          Shipped: shippedCount,
          Delivered: deliveredCount,
          Cancelled: cancelledCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export sales report to Excel
// @route   GET /api/reports/export/excel
// @access  Private/Admin
const exportSalesExcel = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });

    const data = orders.map(o => ({
      'Order ID': o.id,
      'Customer Name': o.User ? o.User.name : 'Guest',
      'Customer Email': o.User ? o.User.email : 'N/A',
      'Total Amount (₹)': parseFloat(o.totalAmount),
      'GST (₹)': parseFloat(o.gstAmount),
      'Discount (₹)': parseFloat(o.discountAmount),
      'Payment Method': o.paymentMethod,
      'Payment Status': o.paymentStatus,
      'Order Status': o.orderStatus,
      'Tracking Number': o.trackingNumber,
      'Order Date': o.createdAt.toISOString().split('T')[0]
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.xlsx');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export sales report to PDF
// @route   GET /api/reports/export/pdf
// @access  Private/Admin
const exportSalesPDF = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']]
    });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');

    doc.pipe(res);

    // Write Header
    doc.fontSize(20).text('Rainbow Jewelry - Sales & Revenue Audit Report', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(10).text(`Generated On: ${new Date().toLocaleString()}`, { align: 'right' });
    doc.moveDown(2);

    // Simple Table formatting
    doc.fontSize(12).text('Order List:', { underline: true });
    doc.moveDown(0.5);

    orders.forEach((o, index) => {
      doc.fontSize(10).text(
        `#${index + 1} | Order ID: ${o.id} | Date: ${o.createdAt.toISOString().split('T')[0]} | Customer: ${o.User ? o.User.name : 'Guest'} | Amount: ₹${o.totalAmount} | Status: ${o.orderStatus} | Payment: ${o.paymentStatus}`
      );
      doc.moveDown(0.3);
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  exportSalesExcel,
  exportSalesPDF
};
