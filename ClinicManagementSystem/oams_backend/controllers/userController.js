const bcrypt = require('bcrypt');
const User = require('../models/User');
const Service = require('../models/Service');
const { checkPassword, newToken } = require('../utils'); 

//after adding provider

// userController.js
const registerUser = async (req, res) => {
  const { email, password, fullName, address, contact, isProvider } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      address,
      contact,
      isProvider,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("in loginUser")
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = newToken(existingUser); // Generate JWT
    const userId = existingUser._id;
    const isProvider = existingUser.isProvider;
    res.status(200).json({ message: 'Login successful', token , userId , isProvider }); // Return JWT to the client
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); 
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};


const addService = async (req, res) => {
  const { userId, title, description, charges, duration, categoryId } = req.body;
  const file = req.file; // Access the uploaded file

  const { street, city, state, country, zip } = req.body; 

  const address = { street, city, state, country, zip }; 

  try {
    const newService = new Service({
      userId,
      title,
      description,
      charges,
      duration,
      categoryId,
      image: file.filename,
      address,
    });

    await newService.save();

    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error adding Doctor:', error);
    res.status(500).json({ message: 'Failed to add Doctor', error: error.message });
  }
};


// Controller function to delete a provider by email
const deleteProvider = async (req, res) => {
  const { email } = req.params;

  try {
    const deletedProvider = await User.findOneAndDelete({ email });

    if (!deletedProvider) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.status(200).json({ message: 'Doctor deleted successfully', deletedProvider });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete Doctor', error: error.message });
  }
};

module.exports = { registerUser, loginUser, getAllUsers, addService, deleteProvider };
