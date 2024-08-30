import React, { useState, useEffect } from "react";
import "../styles/ServiceAppointments.css";

const ServiceAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const userId = window.localStorage.getItem("UserId");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/appointments/ServiceAppointments?userId=${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem(
                "LoginToken"
              )}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setAppointments(data.appointments);
        } else {
          console.error("Failed to fetch appointments:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleAcceptReject = async (appointmentId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/${appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem(
              "LoginToken"
            )}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId ? { ...appointment, status } : appointment
          )
        );

        if (status === "rejected") {
          await handleRefund(appointmentId);
        }

        notifyServer(appointmentId, status);

        console.log(`Appointment ${status} successfully`);
      } else {
        console.error(`Failed to ${status} appointment:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error ${status} appointment:`, error);
    }
  };
  
  const handleRefund = async (appointmentId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/payment/${appointmentId}/refund`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("LoginToken")}`,
          },
          // body: JSON.stringify({
          //   amount: 500100, // Example amount (in the smallest unit of currency)a
          //   speed: "normal", // Optional: Specify refund speed
          //   // notes: {} // Optional: Add notes if needed
          // }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Refund initiated successfully:", responseData);
      } else {
        const errorData = await response.json();
        console.error("Failed to initiate refund:", errorData.error);
      }
    } catch (error) {
      console.error("Error initiating refund:", error);
    }
  };

  const notifyServer = async (appointmentId, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/notify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem(
              "LoginToken"
            )}`,
          },
          body: JSON.stringify({ appointmentId, status }),
        }
      );

      if (response.ok) {
        console.log(`Server notified about the status change.`);
      } else {
        console.error(
          "Failed to notify the server about the status change:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error notifying the server:", error);
    }
  };


  return (
    <div className="container"
     
    >
      <h2>Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointment requests found for your Doctors.</p>
      ) : (
        <ul className="appointments-list">
          {appointments.map((appointment) => (
            <li className="appointment-item" key={appointment._id}>
              <div>
                <span className="service-link">
                  Appointment for Doctor: {appointment.serviceId.title} - Status:{" "}
                  {appointment.status}
                </span>
                <p>
                  Date: {new Date(appointment.createdAt).toLocaleDateString()}
                </p>
                <p>
                  Time: {new Date(appointment.createdAt).toLocaleTimeString()}
                </p>
                <p>User Email: {appointment.userId.email}</p>
              </div>
              {appointment.status === "pending" && (
                <div className="action-buttons">
                  <button
                    className="accept-button"
                    onClick={() =>
                      handleAcceptReject(appointment._id, "accepted")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="reject-button"
                    onClick={() =>
                      handleAcceptReject(appointment._id, "rejected")
                    }
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ServiceAppointments;
