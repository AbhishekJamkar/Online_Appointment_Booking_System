// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import '../styles/ServiceDetails.css';

// const ServiceDetails = () => {
//   const [service, setService] = useState(null);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchServiceDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/home/services/${id}`);
//         if (response.ok) {
//           const data = await response.json();
//           setService(data.service);
//         } else {
//           console.error('Failed to fetch service details:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Failed to fetch service details:', error);
//       }
//     };

//     fetchServiceDetails();
//   }, [id]);

//   if (!service) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="service-details-container">
//       <h2>{service.title}</h2>
//       <img
//         src={service.image}
//         alt={service.title}
//         className="service-details-image"
//         style={{ height: '100%', width: 'auto', backgroundRepeat: 'no-repeat' }}
//       />
//       <p>Description: {service.description}</p>
//       <p>Charges: {service.charges}</p>
//       <p>Duration: {service.duration}</p>
//       {service.address && (
//         <div className="address-details">
//           <h3>Address</h3>
//           <p>Street: {service.address.street}</p>
//           <p>City: {service.address.city}</p>
//           <p>State: {service.address.state}</p>
//           <p>Country: {service.address.country}</p>
//           <p>ZIP Code: {service.address.zip}</p>
//         </div>
//       )}

//       <br/><br/>
      
//       <Link to={`/appoint/${id}`} className="appoint-button">
//         Appoint
//       </Link>
//     </div>
//   );
// };

// export default ServiceDetails;




// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import '../styles/ServiceDetails.css';

// const ServiceDetails = () => {
//   const [service, setService] = useState(null);
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchServiceDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:8080/api/home/services/${id}`);
//         if (response.ok) {
//           const data = await response.json();
//           setService(data.service);
//         } else {
//           console.error('Failed to fetch service details:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Failed to fetch service details:', error);
//       }
//     };

//     fetchServiceDetails();
//   }, [id]);

//   if (!service) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="service-details-container">
//       <div className="service-details-content">
//         <img
//           src={service.image}
//           alt={service.title}
//           className="service-details-image"
//           style={{ height: 'auto', width: '50%', marginRight: '30px', borderRadius: '8px' }}
//         />
//         <div className="service-details-info">
//           <h2 className="service-details-title">{service.title}</h2>
//           <p className="service-details-description">Description: {service.description}</p>
//           <p className="service-details-info">Charges: {service.charges}</p>
//           <p className="service-details-info">Duration: {service.duration}</p>
//           {service.address && (
//             <div className="address-details">
//               <h3>Address</h3>
//               <p>Street: {service.address.street}</p>
//               <p>City: {service.address.city}</p>
//               <p>State: {service.address.state}</p>
//               <p>Country: {service.address.country}</p>
//               <p>ZIP Code: {service.address.zip}</p>
//             </div>
//           )}
//         </div>
//       </div>
//       <Link to={`/appoint/${id}`} className="appoint-button">
//         Appoint Now
//       </Link>
//     </div>
//   );
// };

// export default ServiceDetails;

import React, { useState, useEffect } from 'react';
import { useParams , Link } from 'react-router-dom';
import '../styles/ServiceDetails.css';

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
          console.error('Failed to fetch service details:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch service details:', error);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleAppointClick = () => {
    if (!isAuthenticated) {
      // Show login alert if not authenticated
      setShowLoginAlert(true);
    }
  };

  return (
    <div className="service-details-container">
      <h2>{service?.title}</h2>
      <img
        src={service?.image}
        alt={service?.title}
        className="service-details-image"
        style={{ height: '100%', width: 'auto', backgroundRepeat: 'no-repeat' }}
      />
      <p>Description: {service?.description}</p>
      <p>Charges: {service?.charges}</p>
      <p>Duration: {service?.duration}</p>
      {service?.address && (
        <div className="address-details">
          <h3>Address</h3>
          <p>Street: {service.address.street}</p>
          <p>City: {service.address.city}</p>
          <p>State: {service.address.state}</p>
          <p>Country: {service.address.country}</p>
          <p>ZIP Code: {service.address.zip}</p>
        </div>
      )}

      {showLoginAlert && (
        <div className="login-alert">
          <p>Please login to appoint this service.</p>
          {/* <button onClick={() => setShowLoginAlert(false)}>Close</button> */}
        </div>
      )}

      <br/><br/>
      {isAuthenticated && (
        <Link to={`/appoint/${id}`} className="appoint-button">
          Appoint
        </Link>
      )}
      {!isAuthenticated && (
        <button className="appoint-button" onClick={handleAppointClick}>
          Appoint
        </button>
      )}
    </div>
  );
};

export default ServiceDetails;
