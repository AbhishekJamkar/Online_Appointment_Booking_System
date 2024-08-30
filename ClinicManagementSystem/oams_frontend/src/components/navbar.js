import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../utils/localStorage";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userId = window.localStorage.getItem("UserId");
  const isProvider = window.localStorage.getItem("IsProvider");
  const userEmail = window.localStorage.getItem("UserEmail");
  const formattedEmail = userEmail ? userEmail.split('@')[0] : '';

  return (
    <nav style={{ backgroundColor: "#333", color: "#fff", padding: "5px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }} className="navbar-container">
        <ul style={{ listStyleType: "none", display: "flex", alignItems: "center" }} className="navbar-links">
          <li>
            <Link to="/" style={{ marginRight: "20px" }} className="navbar-link">
              <img src="https://theruntime.com/wp-content/uploads/2021/02/appointy.png" alt="Appointy Logo" style={{ height: "35px" }} />
            </Link>
          </li>
          {/* <li>
            <Link to="/" style={{ textDecoration: "none", color: "#3ec8d8", marginRight: "20px" }} className="navbar-link">
              Appointy
            </Link>
          </li> */}
          <li>
            <Link to="/home" style={{ textDecoration: "none", color: "#fff", marginRight: "20px", transition: "box-shadow 0.3s, border-radius 0.3s", borderRadius: "20px", padding: "10px" }} className="navbar-link" 
            onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 4px rgba(94, 203, 233, 0.2)'}
            onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
              Home
            </Link>
          </li>
          {userId && isProvider === "true" && (
            <li>
              <Link to="/addServices" style={{ textDecoration: "none", color: "#fff", marginRight: "20px", transition: "box-shadow 0.3s, border-radius 0.3s", borderRadius: "20px", padding: "10px" }} className="navbar-link"
              onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 4px rgba(94, 203, 233, 0.2)'}
              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                Add Doctors
              </Link>
            </li>
          )}
          {!userId && (
            <>
              <li>
                <Link to="/register" style={{ textDecoration: "none", color: "#fff", marginRight: "20px", transition: "box-shadow 0.3s, border-radius 0.3s", borderRadius: "20px", padding: "10px" }} className="navbar-link" 
                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 4px rgba(94, 203, 233, 0.2)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ textDecoration: "none", color: "#fff", marginRight: "20px", transition: "box-shadow 0.3s, border-radius 0.3s", borderRadius: "20px", padding: "10px" }} className="navbar-link" 
                onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 4px rgba(94, 203, 233, 0.2)'}
                onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                  Login
                </Link>
              </li>
            </>
          )}
          {userId && isProvider === "true" && (
            <li>
              <Link to="/service-appointments" style={{ textDecoration: "none", color: "#fff", marginRight: "20px", transition: "box-shadow 0.3s, border-radius 0.3s", borderRadius: "20px", padding: "10px" }} className="navbar-link"
              onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 4px rgba(94, 203, 233, 0.2)'}
              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                Doctor Appointments
              </Link>
            </li>
          )}
          {userId && (
            <li>
              <Link to="/requested-services" style={{ textDecoration: "none", color: "#fff", marginRight: "20px", transition: "box-shadow 0.3s, border-radius 0.3s", borderRadius: "20px", padding: "10px" }} className="navbar-link"
              onMouseEnter={(e) => e.target.style.boxShadow = '0 2px 4px rgba(94, 203, 233, 0.2)'}
              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}>
                Requested Appointments
              </Link>
            </li>
          )}
        </ul>
        <ul style={{ listStyleType: "none", display: "flex", alignItems: "center" }} className="navbar-links">
          {userId && (
            <li className="logout-button">
              {/* Display user's email here */}
              <span style={{ marginRight: "20px" }}>Welcome, {formattedEmail}</span>
              <button style={{ backgroundColor: "red", border: "none", color: "#fff", cursor: "pointer", padding: "5px 10px", borderRadius: "5px" }} onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
