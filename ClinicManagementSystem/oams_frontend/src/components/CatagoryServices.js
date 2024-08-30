import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Category = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState({});
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/home/category/${categoryId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched Specialization data:", data);
          setCategory(data.category || {});
          setServices(data.services || []);
        } else {
          console.error("Failed to fetch Specialization:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching Specialization:", error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/home/services/${id}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setServices(services.filter((service) => service._id !== id));
      } else {
        console.error("Failed to delete Doctor:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to delete Doctor:", error);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(to right, #A9f1df, #FFBBBB)",
        minHeight: "100vh",
      }}
    >
      <div className="category-container">
        <h2 className="category-title">{category.title}</h2>
        <br />

        <h2 className="services-title"> Available Doctors</h2>
        <div className="services-grid">
          {services && services.length > 0 ? (
            services.map((service) => (
              <div key={service._id} className="service-item">
                <img
                  src={require(`../serviceImages/${service.image}`)}
                  alt="Service"
                  className="service-image"
                  style={{
                    width: "200px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />

                <br />
                <h4 className="service-title">{service.title}</h4>
                <br />
                <p className="service-description">
                  Description:{" "}
                  {service.description.length > 110
                    ? `${service.description.slice(0, 110)}...`
                    : service.description}
                </p>
                <p className="service-charges">Charges: {service.charges}</p>
                <p className="service-duration">Duration: {service.duration}</p>

                <div className="button-container">
                  <Link to={`/services/${service._id}`} className="view-button">
                    View Details
                  </Link>
                  {window.localStorage.getItem("UserId") === service.userId && (
                    <>
                      <Link
                        className="edit-button"
                        to={`/services/edit/${service._id}`}
                      >
                        Update
                      </Link>
                      <button
                        className="delete-button"
                        onClick={() => handleDelete(service._id)}
                        style={{
                          width: "75px",
                          height: "38px",
                          objectFit: "cover",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No Doctors available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
