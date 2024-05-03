import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState({});
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/home/category/${categoryId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched category data:', data);
          setCategory(data.category || {});  // Set an empty object if category is undefined
          setServices(data.services || []);
        } else {
          console.error('Failed to fetch category:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/home/services/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setServices(services.filter((service) => service._id !== id));
      } else {
        console.error('Failed to delete service:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };


  return (
    <div className="category-container">
      <h2 className="category-title">{category.title}</h2>
      <br />

      <h2 className="services-title">Services in this Category</h2>
      {/* <div className="services-grid">
        {services.map((service) => (
          <div key={service._id} className="service-item" style={{ backgroundColor: '#3B3C36', color: 'white' }}>
            <img
              src={service.image}
              alt="Service"
              className="service-image"
              style={{ width: '200px', height: '150px', objectFit: 'cover' }}
            />
            <br></br>
            <h4 className="service-title">{service.title}</h4>
            <br></br>
            <p className="service-description">Description: {service.description}</p>
            <p className="service-charges">Charges: {service.charges}</p>
            <p className="service-duration">Duration: {service.duration}</p>
            <Link to={`/services/${service._id}`} className="view-button">
                View Details
              </Link>
          </div>
        ))}
      </div> */}
      <div className="services-grid">
        {services && services.length > 0 ? (
          services.map((service) => (
            <div key={service._id} className="service-item">
              <img
                src={service.image}
                alt="Service"
                className="service-image"
                style={{ width: '200px', height: '150px', objectFit: 'cover' }}
              />
              <br></br>
              <h4 className="service-title">{service.title}</h4>
              <br></br>
              <p className="service-description">
                Description: {service.description.length > 110 ? `${service.description.slice(0, 110)}...` : service.description}
              </p>
              <p className="service-charges">Charges: {service.charges}</p>
              <p className="service-duration">Duration: {service.duration}</p>

              <div className="button-container">
                <Link to={`/services/${service._id}`} className="view-button">
                  View Details
                </Link>
                {window.localStorage.getItem("UserId") === service.userId && (
                  <>
                    <button className="delete-button" onClick={() => handleDelete(service._id)}>Delete</button>
                    <Link className="update-button" to={`/services/edit/${service._id}`} >
                      Update
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No services available.</p>
        )}
      </div>
    </div>
  );
};

export default Category;
