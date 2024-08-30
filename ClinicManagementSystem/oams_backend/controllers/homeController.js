const Service = require('../models/Service');
const Category = require('../models/Category');

const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ services });
  } catch (error) {
    console.error('Error fetching Specializations:', error);
    res.status(500).json({ message: 'Error fetching Specializations', error: error.message });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ service });
  } catch (error) {
    console.error('Error fetching Doctor by ID:', error);
    res.status(500).json({ message: 'Error fetching Doctor', error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching Specializations:', error);
    res.status(500).json({ message: 'Error fetching Specializations', error: error.message });
  }
};

const getServicesByCategory = async (req, res) => {
  const { categoryId } = req.params;
  console.log('Fetching Doctors for Specialization:', categoryId);

  try {
    const services = await Service.find({ categoryId }).populate('categoryId');
    console.log('Fetched Doctors:', services);
    res.status(200).json({ services });
  } catch (error) {
    console.error('Error fetching Doctors by Specialization:', error);
    res.status(500).json({ message: 'Error fetching Doctors by Specialization', error: error.message });
  }
};

const addOrUpdateService = async (req, res) => {
  const { id } = req.params;
  const serviceData = req.body;

  try {
    let service;
    if (id) {
      service = await Service.findByIdAndUpdate(id, serviceData, { new: true });
      if (!service) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      res.status(200).json({ message: 'Doctor updated successfully', service });
    } else {
      const newService = await Service.create(serviceData);
      res.status(201).json({ message: 'Doctor added successfully', service: newService });
    }
  } catch (error) {
    console.error('Error adding/updating Doctor:', error);
    res.status(500).json({ message: 'Error adding/updating Doctor', error: error.message });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(200).json({ message: 'Doctor deleted successfully', service });
  } catch (error) {
    console.error('Error deleting Doctor:', error);
    res.status(500).json({ message: 'Error deleting Doctor', error: error.message });
  }
};

module.exports = { getAllServices, getServiceById, getAllCategories, getServicesByCategory, addOrUpdateService, deleteService };
