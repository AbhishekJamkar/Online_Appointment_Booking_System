import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component

const AddCategories = () => {
  const [categoryData, setCategoryData] = useState({
    title: '',
    image: '', 
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    setCategoryData({ ...categoryData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('http://localhost:8080/api/category/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        setSuccessMessage('Specialization added successfully');
        setCategoryData({ title: '', image: '' }); // Clear form fields
      } else {
        const errorMessage = await response.text();
        setError(`Failed to add specialization: ${errorMessage}`);
      }
    } catch (error) {
      setError('Failed to add specialization: Please try again later');
    }
  };

  return (
    <div style={{ background: "linear-gradient(to right, #A9f1df, #FFBBBB)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <h2>Add Specialization</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <input
          type="text"
          placeholder="Specialization Title"
          name="title"
          value={categoryData.title}
          onChange={handleInputChange}
          style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          required
        />
        <input
          type="url"
          placeholder="Image URL"
          name="image"
          value={categoryData.image}
          onChange={handleInputChange}
          style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
          required
        />
        <button type="submit" style={{ padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Add Specialization</button>
      </form>
      {/* Link button to navigate back to the admin page */}
      <Link to="/admin" style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", textDecoration: "none", borderRadius: "8px" }}>Back to Admin</Link>
    </div>
  );
};

export default AddCategories;
