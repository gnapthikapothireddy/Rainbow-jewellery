const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Public/Private (userId is optional)
const bookAppointment = async (req, res) => {
  try {
    const { name, phone, email, branch, date, time, purpose, notes } = req.body;
    const userId = req.user ? req.user.id : null;

    const appointment = await Appointment.create({
      userId,
      name,
      phone,
      email,
      branch,
      date,
      time,
      purpose,
      notes
    });

    // Notify Admins
    await Notification.create({
      userId: null, // Admin alert
      title: 'New Appointment Booked',
      message: `Appointment requested by ${name} for ${purpose} at ${branch} branch on ${date} at ${time}.`,
      type: 'appointment'
    });

    // Notify User (if logged in)
    if (userId) {
      await Notification.create({
        userId,
        title: 'Appointment Scheduled',
        message: `Your appointment request for ${purpose} on ${date} has been received. Status: Pending approval.`,
        type: 'appointment'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user appointments
// @route   GET /api/appointments/mybookings
// @access  Private
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.user.id },
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all appointments (Admin only)
// @route   GET /api/appointments
// @access  Private/Admin
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['date', 'DESC'], ['time', 'ASC']]
    });
    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update appointment status (Admin only)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, date, time } = req.body;
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment booking not found' });
    }

    appointment.status = status || appointment.status;
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    await appointment.save();

    // Notify User
    if (appointment.userId) {
      let msg = `Your appointment status has been updated to "${appointment.status}".`;
      if (status === 'Rescheduled') {
        msg = `Your appointment has been rescheduled to ${appointment.date} at ${appointment.time}. Please confirm if this works.`;
      }

      await Notification.create({
        userId: appointment.userId,
        title: `Appointment Update: ${appointment.status}`,
        message: msg,
        type: 'appointment'
      });
    }

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus
};
