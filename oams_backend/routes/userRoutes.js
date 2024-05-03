const express = require('express');
const router = express.Router();
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });
const { registerUser, loginUser, getAllUsers , addService} = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/addServices', addService);

// Route to fetch all users (for admin)
router.get('/', getAllUsers);

module.exports = router;
