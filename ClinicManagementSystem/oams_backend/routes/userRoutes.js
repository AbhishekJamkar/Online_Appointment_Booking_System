const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  registerUser,
  loginUser,
  getAllUsers,
  addService,
  deleteProvider,
} = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination path to the desired location
    cb(null, "D:/ClinicManagementSystem/oams_frontend/src/serviceImages");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/addServices", upload.single("file"), addService);

router.post("/register", registerUser);
router.post("/login", loginUser);

// router.post('/addServices', addService);

// Route to fetch all users (for admin)
router.delete('/deleteProvider/:email', deleteProvider);

router.get("/", getAllUsers);

module.exports = router;
