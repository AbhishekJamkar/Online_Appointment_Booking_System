import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import detailsPage from "../images/detailsPage.webp";

const ServiceDetails = () => {
  const [service, setService] = useState(null);
  const { id } = useParams();
  const isAuthenticated = window.localStorage.getItem("UserId");
  const [showLoginAlert, setShowLoginAlert] = useState(false); // State to control alert visibility

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/home/services/${id}`);
        if (response.ok) {
          const data = await response.json();
          setService(data.service);
        } else {
          console.error('Failed to fetch Doctor details:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch Doctor details:', error);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleAppointClick = () => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
    }
  };

  return (
    <div style={{ 
      background: "linear-gradient(to right, #A9f1df, #FFBBBB)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ flex: 1, padding: "20px" }}>
        <img
          src={detailsPage}
          alt="Calendar"
          style={{ width: "50%", height: "auto" }}
        />
      </div>
      <div style={{ flex: 1, padding: "20px", maxWidth: "600px" }}>
        {service && (
          <div style={{ padding: "20px", borderRadius: "10px", boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)", background: "white" }}>
            <h2>{service.title}</h2>
            {service.image && ( // Conditionally render the image if service.image exists
              <img
                src={require(`../serviceImages/${service.image}`)}
                alt={service.title}
                style={{ width: "45%", height: "auto", marginBottom: "10px", borderRadius: "8px" }}
              />
            )}
            <p>Description: {service.description}</p>
            <p>Charges: {service.charges} (in rupees)</p>
            <p>Duration: {service.duration} (in minutes)</p>
            {service.address && (
              <div className="address-details">
                <h3>Address</h3>
                <p>Street: {service.address.street} | City: {service.address.city} | State: {service.address.state} | Country: {service.address.country}</p>
                <p>Phone Number: {service.address.zip}</p>
              </div>
            )}

            {showLoginAlert && (
              <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f8d7da", color: "#721c24", border: "1px solid #f5c6cb", borderRadius: "5px" }}>
                <p>Please login to appoint this Doctor.</p>
              </div>
            )}

            <br/><br/>
            {isAuthenticated && (
              <Link to={`/appoint/${id}`} style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", textDecoration: "none", cursor: "pointer", display: "inline-block", transition: "background-color 0.3s" }}>
                Appoint
              </Link>
            )}
            {!isAuthenticated && (
              <button onClick={handleAppointClick} style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", textDecoration: "none", cursor: "pointer", display: "inline-block", transition: "background-color 0.3s" }}>
                Appoint
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetails;
