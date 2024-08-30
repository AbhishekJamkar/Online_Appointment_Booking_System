const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceId: {
    type: mongoose.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected' , 'refunded'],
    default: 'pending',
  },
  paymentId: {
    type: String, 
    required: true,
  },
}, {
  timestamps: true,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
