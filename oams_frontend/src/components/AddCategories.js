import React, { useState } from 'react';

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
        setSuccessMessage('Category added successfully');
        setCategoryData({ title: '', image: '' }); // Clear form fields
      } else {
        const errorMessage = await response.text();
        setError(`Failed to add category: ${errorMessage}`);
      }
    } catch (error) {
      setError('Failed to add category: Please try again later');
    }
  };

  return (
    <div>
      <h2>Add Category</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Title"
          name="title"
          value={categoryData.title}
          onChange={handleInputChange}
          required
        />
        <input
          type="url"
          placeholder="Image URL"
          name="image"
          value={categoryData.image}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Category</button>
      </form>
    </div>
  );
};

export default AddCategories;
