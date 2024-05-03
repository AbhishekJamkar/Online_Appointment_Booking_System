// export default AddServices;


import React, { useState, useEffect } from 'react';
import '../styles/AddServices.css';

const AddServices = () => {
  const [serviceData, setServiceData] = useState({
    userId: window.localStorage.getItem("UserId"),
    title: '',
    description: '',
    charges: '',
    duration: '',
    image: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zip: '',
    },
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/home/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          setError('Failed to fetch categories');
        }
      } catch (error) {
        setError('Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
  
    // If the input field is part of the address object
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setServiceData(prevData => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value
        }
      }));
    } else {
      setServiceData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };
  

  const onCategoryChange = (e) => {
    setServiceData({ ...serviceData, categoryId: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/users/addServices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData),
      });

      if (response.ok) {
        setSuccessMessage('Service added successfully');
        setServiceData({
          userId: window.localStorage.getItem("UserId"),
          title: '',
          description: '',
          charges: '',
          duration: '',
          image: '',
          address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zip: '',
          },
          categoryId: '',
        });
      } else {
        setError('Failed to add service');
      }
    } catch (error) {
      setError('Failed to add service');
    }
  };

  return (
    <div className="add-services-container">
      <h2>Add Services</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={onSubmit} className="add-services-form">
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={serviceData.title}
          onChange={onChange}
          required
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={serviceData.description}
          onChange={onChange}
          required
        />
        <input
          type="number"
          placeholder="Charges"
          name="charges"
          value={serviceData.charges}
          onChange={onChange}
          required
        />
        <input
          type="number"
          placeholder="Duration"
          name="duration"
          value={serviceData.duration}
          onChange={onChange}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          name="image"
          value={serviceData.image}
          onChange={onChange}
          required
        />
        <select
          name="categoryId"
          value={serviceData.categoryId}
          onChange={onCategoryChange}
          required
        >
          <option value="" disabled>Select Category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.title}</option>
          ))}
        </select>
        <div className="address-fields">
          <input
            type="text"
            placeholder="Street"
            name="address.street"
            value={serviceData.address.street}
            onChange={onChange}
            required
          />
          <input
            type="text"
            placeholder="City"
            name="address.city"
            value={serviceData.address.city}
            onChange={onChange}
            required
          />
          <input
            type="text"
            placeholder="State"
            name="address.state"
            value={serviceData.address.state}
            onChange={onChange}
            required
          />
          <input
            type="text"
            placeholder="Country"
            name="address.country"
            value={serviceData.address.country}
            onChange={onChange}
            required
          />
          <input
            type="text"
            placeholder="ZIP Code"
            name="address.zip"
            value={serviceData.address.zip}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Add Service</button>
      </form>
    </div>
  );
};

export default AddServices;
