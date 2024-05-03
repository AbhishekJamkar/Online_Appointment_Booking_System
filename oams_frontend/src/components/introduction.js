import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Introduction.css'; 
// import {isLogin} from "../utils/localStorage"

const Introduction = () => {
  return (
    <div className="introduction-container">
      <header className="introduction-header">
        {/* <img
          src="https://source.unsplash.com/1600x900/?appointment"
          alt="Appointment Management System"
          className="header-image"
        /> */}
        <h1>Welcome to Our Appointment Management System</h1>
        <p>Your Solution for Seamless Appointment Scheduling</p>
      </header>

      <section className="introduction-section">
        <h2>About Us</h2>
        <img
          src="https://source.unsplash.com/1600x900/?team"
          alt="Team Collaboration"
          className="section-image"
        />
        <p>
          At Appointment Management System, we understand the importance of efficient and hassle-free appointment scheduling.
          Our platform is designed to streamline the entire appointment process, making it easy for both businesses and clients.
        </p>

        <h2>Key Features</h2>
        <img
          src="https://source.unsplash.com/1600x900/?clock"
          alt="Clock for Real-Time"
          className="section-image"
        />
        <ul>
          <li>Easy Online Scheduling</li>
          <li>Real-Time Availability</li>
          <li>Automated Reminders</li>
          <li>Secure User Authentication</li>
          <li>Customizable Booking Options</li>
          {/* <li>{isLogin}</li> */}

        </ul>

        <h2>Get Started Today</h2>
        <img
          src="https://source.unsplash.com/1600x900/?schedule"
          alt="Appointment Scheduler"
          className="section-image"
        />
        <p>
          Ready to experience the convenience of our Appointment Management System? Click the button below to get started.
        </p>
        {
          window.localStorage.getItem("UserId") ? (<Link to="/Home" className="cta-button">Schedule an Appointment</Link>) : <Link to="/login" className="cta-button">Schedule an Appointment</Link>  
        }
        
      </section>
    </div>
  );
};

export default Introduction;
