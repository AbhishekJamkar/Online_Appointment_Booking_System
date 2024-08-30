// categoryController.js

const Category = require('../models/Category');

const addCategory = async (req, res) => {
  const { title, image } = req.body;

  try {
    const newCategory = new Category({
      title,
      image,
    });

    await newCategory.save();
    res.status(201).json({ message: 'Specialization added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add Specialization', error: error.message });
  }
};

module.exports = { addCategory };
