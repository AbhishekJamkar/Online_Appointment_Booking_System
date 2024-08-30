const mongoose = require('mongoose');

const serviceSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categoryId: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  charges: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
 