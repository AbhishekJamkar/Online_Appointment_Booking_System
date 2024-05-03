
// const express = require('express');
// const router = express.Router();
// const { getAllServices, getServiceById, getAllCategories, getServicesByCategory } = require('../controllers/homeController');

// router.get('/services', getAllServices);
// router.get('/services/:id', getServiceById);
// router.get('/categories', getAllCategories);
// router.get('/category/:categoryId', getServicesByCategory); // Added route for category-specific services

// module.exports = router;


const express = require('express');
const router = express.Router();
const { getAllServices, getServiceById, getAllCategories, getServicesByCategory, addOrUpdateService, deleteService } = require('../controllers/homeController');

router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.get('/categories', getAllCategories);
router.get('/category/:categoryId', getServicesByCategory); // Added route for category-specific services

// Add routes for adding or updating a service
router.post('/services', addOrUpdateService);
router.put('/services/:id', addOrUpdateService);

// Add route for deleting a service
router.delete('/services/:id', deleteService);

module.exports = router;
