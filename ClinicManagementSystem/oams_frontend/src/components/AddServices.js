import React, { useState, useEffect } from "react";
import "../styles/AddServices.css";

const AddServices = () => {
  const [serviceData, setServiceData] = useState({
    userId: window.localStorage.getItem("UserId"),
    title: "",
    description: "",
    charges: "",
    duration: "",
    file: null, // Added file field
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zip: "",
    },
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/home/categories"
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          setError("Failed to fetch categories");
        }
      } catch (error) {
        setError("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const onChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setServiceData({ ...serviceData, file: files[0] });
    } else if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setServiceData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else {
      setServiceData((prevData) => ({
        ...prevData,
        [name]: value,
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
  
    const formData = new FormData();
    formData.append('userId', serviceData.userId);
    formData.append('title', serviceData.title);
    formData.append('description', serviceData.description);
    formData.append('charges', serviceData.charges);
    formData.append('duration', serviceData.duration);
    formData.append('categoryId', serviceData.categoryId);
    formData.append('street', serviceData.address.street);
    formData.append('city', serviceData.address.city);
    formData.append('state', serviceData.address.state);
    formData.append('country', serviceData.address.country);
    formData.append('zip', serviceData.address.zip);
    formData.append('file', serviceData.file);
  
    try {
      const response = await fetch('http://localhost:8080/api/users/addServices', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        setSuccessMessage('Service added successfully');
        setServiceData({
          userId: window.localStorage.getItem("UserId"),
          title: '',
          description: '',
          charges: '',
          duration: '',
          file: null, // Reset file field after successful submission
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
      <h2>Add Doctor</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={onSubmit} className="add-services-form">
        <input
          type="text"
          placeholder="Doctor Name"
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
          type="file"
          accept="image/*"
          name="file"
          onChange={onChange}
          required
        />
        <select
          name="categoryId"
          value={serviceData.categoryId}
          onChange={onCategoryChange}
          required
        >
          <option value="" disabled>
            Select Specialization
          </option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
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
            placeholder="Phone Number"
            name="address.zip"
            value={serviceData.address.zip}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit">Add Doctor</button>
      </form>
    </div>
  );
};

export default AddServices;
