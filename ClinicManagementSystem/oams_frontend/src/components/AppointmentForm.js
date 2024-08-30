import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment-timezone"; // Import moment-timezone
import upiAutopayImage from "../images/UPI-autopay-image.gif"

const AppointmentForm = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("Please agree to the terms before booking.");
      return;
    }

    const selectedDateTime = new Date(`${date}T${time}`);
    const currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime) {
      alert("Please select a future date and time for the appointment.");
      return;
    }

    // Validate time format
    if (!moment(time, "HH:mm", true).isValid()) {
      alert("Please select a valid time.");
      return;
    }

    // Check if an appointment already exists for the selected date and time
    const existingAppointmentResponse = await fetch(
      `http://localhost:8080/api/appointments/checkAvailability?serviceId=${id}&date=${moment(
        selectedDateTime
      )
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD")}&time=${moment(time, "HH:mm")
        .tz("Asia/Kolkata")
        .format("HH:mm")}`,
      {
        method: "GET",
      }
    );

    if (existingAppointmentResponse.ok) {
      const existingAppointmentData = await existingAppointmentResponse.json();

      if (existingAppointmentData.appointments.length > 0) {
        alert(
          "Appointment already booked for the selected date and time. Please choose a different time."
        );
        return;
      }
    } else {
      console.error(
        "Error checking existing appointments:",
        existingAppointmentResponse.statusText
      );
      return;
    }

    // Proceed with payment and appointment submission
    try {
      const response = await fetch("http://localhost:8080/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: window.localStorage.getItem("UserId"),
          serviceId: id,
          date: date,
          time: time,
        }),
      });

      if (response.status === 200) {
        const resData = await response.json();

        const successCallback = () => {
          handleAppointmentSubmit(resData.data, resData.saveAppointment);
        };

        initPayment(resData.data, resData.saveAppointment, successCallback);
      } else {
        console.error("Error creating order:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending order data:", error);
    }
  };

  const handleAppointmentSubmit = async (orderData, AppointmentData) => {
    const selectedDateTime = new Date(`${date}T${time}`);

    try {
      // Format date and time using moment-timezone
      const formattedDate = moment(selectedDateTime)
        .tz("Asia/Kolkata") // Set the desired timezone (India in this case)
        .format("YYYY-MM-DD");
      const formattedTime = moment(selectedDateTime)
        .tz("Asia/Kolkata") // Set the desired timezone (India in this case)
        .format("HH:mm");

      // If no existing appointment, submit the new appointment
      const response = await fetch("http://localhost:8080/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: window.localStorage.getItem("UserId"),
          serviceId: id,
          date: formattedDate,
          time: formattedTime,
          paymentId: orderData.id,
        }),
      });

      if (response.ok) {
        console.log("Appointment submitted successfully!");
        navigate("/home");
      } else {
        console.error("Failed to submit appointment:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  const loadRazorpayScript = async () => {
    // Fetch Razorpay script
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = resolve;
      document.head.appendChild(script);
    });
  };

  const initPayment = async (data, AppointmentData, successCallback) => {
    await loadRazorpayScript();
    const amount_to_pay = AppointmentData.book_cost * 100;

    const options = {
      key: process.env.REACT_APP_API_KEY,
      amount: amount_to_pay,
      currency: data.currency,
      name: `Package: Appointy`,
      description: "Testing",
      image: AppointmentData.packImage,
      order_id: data.id,
      handler: async (response) => {
        try {
          const newResponse = {
            response,
            AppointmentData,
          };
          const apiResponse = await fetch(
            "http://localhost:8080/api/payment/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newResponse),
            }
          );

          const responseData = await apiResponse.json();
          console.log(responseData.message);

          if (apiResponse.status === 200) {
            successCallback();
            window.alert("Your Bookings Are Confirmed");
            navigate("/Home");
          } else {
            throw new Error("Booking Failed");
          }
        } catch (error) {
          console.error("Error in handler function:", error);
        }
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(to right, #A9f1df, #FFBBBB)",
      }}
    >
      <div
        style={{
          display: "flex",
          maxWidth: "800px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          background: "white",
        }}
      >
        <div style={{ flex: 1 }}>
          <img
            src={upiAutopayImage}
            alt="Razorpay"
            style={{ maxWidth: "100%", height: "auto", borderRadius: "10px 0 0 10px" }}
          />
        </div>
        <div style={{ flex: 1, padding: "20px" }}>
          <h2>Book Appointment</h2>
          <form onSubmit={handlePayment}>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                marginBottom: "10px",
                display: "block",
                width: "50%",
                padding: "8px",
                borderRadius: "20px",
                margin: "0 auto", // Center the input box
              }}
            />
            <br />
            <label htmlFor="time">Time:</label>
            <input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              style={{
                marginBottom: "10px",
                display: "block",
                width: "50%",
                padding: "8px",
                borderRadius: "20px",
                margin: "0 auto", // Center the input box
              }}
            />
            <br />
            <label>
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
              />
              I agree to the <a href="https://www.appointment.com/terms-conditions">terms</a>
            </label>
            <br />
            <br></br>
            <button
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                textDecoration: "none",
                cursor: "pointer",
                display: "inline-block",
                transition: "background-color 0.3s",
                marginTop: "10px",
                margin: "0 auto", // Center the button
              }}
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
