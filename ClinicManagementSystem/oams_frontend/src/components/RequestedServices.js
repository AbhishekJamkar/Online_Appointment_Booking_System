import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/RequestedServices.css";

const RequestedServices = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = window.localStorage.getItem("UserId");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/appointments/RequestedServices?userId=${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAppointments(data.appointments);
        } else {
          const errorMessage = await response.text();
          setError(`Failed to fetch appointments: ${errorMessage}`);
        }
      } catch (error) {
        setError(`Error fetching appointments: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.filter(
            (appointment) => appointment._id !== appointmentId
          )
        );
      } else {
        const errorMessage = await response.text();
        setError(`Failed to delete appointment: ${errorMessage}`);
      }
    } catch (error) {
      setError(`Error deleting appointment: ${error.message}`);
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
      <div className="container">
        <h2>Requested Appointments</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : appointments.length === 0 ? (
          <p>No appointment requests found.</p>
        ) : (
          <ul className="appointments-list">
            {appointments.map((appointment) => (
              <li className="appointment-item" key={appointment._id}>
                <div className="appointment-info">
                  <span
                    to={`/appoint/${appointment._id}`}
                    className="service-link"
                    style={{ color: "#007bff", textDecoration: "underline", cursor: "pointer" }}
                  >
                    {appointment.serviceId && appointment.serviceId.title}
                  </span>
                  <span className="service-id">
                    Appointment ID: {appointment.serviceId ? appointment.serviceId._id : ''}
                  </span>
                  <span className="appointment-date">
                    Date: {new Date(appointment.date).toLocaleDateString()}
                  </span>
                  <span className="appointment-time">
                    Time: {appointment.time}
                  </span>
                  <span className="appointment-status">
                    Status: {appointment.status}
                  </span>
                  {appointment.status === "Pending" || appointment.status === "accepted" && new Date(appointment.date) > new Date() && (
                    <button
                      className="cancel-button"
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RequestedServices;
