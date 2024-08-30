import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ServiceUpdate.css'; // Import the CSS file

const ServiceUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState({
    userId: '',
    categoryId: '',
    title: '',
    description: '',
    charges: 0,
    duration: 0,
    image: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      PhoneNo: '',
    },
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/home/services/${id}`);
        if (response.ok) {
          const data = await response.json();
          setService(data.service);
        } else {
          console.error('Failed to fetch Doctor:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch Doctor:', error);
      }
    };

    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/home/services/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      });
      if (response.ok) {
        console.log('Doctor updated successfully');
        navigate(`/services/${id}`);
      } else {
        console.error('Failed to update Doctor:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update Doctor:', error);
    }
  };

  return (
    <div className="service-update-container">
      <h2>Update Doctor Details</h2>
      <form className="update-form" onSubmit={handleSubmit}>
        <div className="form-group input-inline">
          <label>Doctor Name:</label>
          <input type="text" name="title" value={service.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={service.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group input-inline">
          <label>Charges:</label>
          <input type="number" name="charges" value={service.charges} onChange={handleChange} />
        </div>
        <div className="form-group input-inline">
          <label>Duration:</label>
          <input type="number" name="duration" value={service.duration} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Image Name:</label>
          <input type="text" name="image" value={service.image} onChange={handleChange} />
        </div>
        <div className="address-group">
          <h3>Address</h3>
          <div className="form-group input-inline">
            <label>Street:</label>
            <input type="text" name="street" value={service.address.street} onChange={(e) => handleChange({ target: { name: 'address', value: { ...service.address, street: e.target.value } } })} />
          </div>
          <div className="form-group input-inline">
            <label>City:</label>
            <input type="text" name="city" value={service.address.city} onChange={(e) => handleChange({ target: { name: 'address', value: { ...service.address, city: e.target.value } } })} />
          </div>
          <div className="form-group input-inline">
            <label>State:</label>
            <input type="text" name="state" value={service.address.state} onChange={(e) => handleChange({ target: { name: 'address', value: { ...service.address, state: e.target.value } } })} />
          </div>
          <div className="form-group input-inline">
            <label>Country:</label>
            <input type="text" name="country" value={service.address.country} onChange={(e) => handleChange({ target: { name: 'address', value: { ...service.address, country: e.target.value } } })} />
          </div>
          <div className="form-group input-inline">
            <label>ZIP:</label>
            <input type="text" name="zip" value={service.address.zip} onChange={(e) => handleChange({ target: { name: 'address', value: { ...service.address, zip: e.target.value } } })} />
          </div>
        </div>
        <button type="submit" className="updatePage-button">Update</button>
      </form>
    </div>
  );
};

export default ServiceUpdate;
