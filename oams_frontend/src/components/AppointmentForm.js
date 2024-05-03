// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";

// const AppointmentForm = () => {
//   const [date, setDate] = useState("");
//   const [time, setTime] = useState("");
//   const [agreedToTerms, setAgreedToTerms] = useState(false);
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const loadRazorpayScript = async () => {
//     // Fetch Razorpay script
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = resolve;
//       document.head.appendChild(script);
//     });
//   };

//   const initPayment = async (data, AppointmentData, successCallback) => {
//     console.log("initPayment--------------------------------------------");
//     await loadRazorpayScript();
//     console.log("after loadRazorpayScript-------------");
//     const amount_to_pay = AppointmentData.book_cost * 100;

//     const options = {
//       key: process.env.REACT_APP_API_KEY,
//       amount: amount_to_pay,
//       currency: data.currency,
//       name: `Package: ${AppointmentData.packageName}`,
//       description: "Testing",
//       image: AppointmentData.packImage,
//       order_id: data.id,
//       handler: async (response) => {
//         try {
//           const newResponse = {
//             response,
//             AppointmentData,
//           };
//           console.log("newResponse in going verify------------");
//           const apiResponse = await fetch(
//             "http://localhost:8080/api/payment/verify",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(newResponse),
//             }
//           );

//           const responseData = await apiResponse.json();
//           console.log(responseData.message);

//           if (apiResponse.status === 200) {
//             successCallback();
//             window.alert("Your Bookings Are Confirmed");
//             navigate("/Home");
//           } else {
//             throw new Error("Booking Failed");
//           }
//         } catch (error) {
//           console.error("Error in handler function:", error);
//         }
//       },
//     };

//     const rzp1 = new window.Razorpay(options);
//     rzp1.open();
//   };

//   const handlePayment = async (e) => {
//     e.preventDefault();

//     if (!agreedToTerms) {
//       alert("Please agree to the terms before booking.");
//       return;
//     }

//     const selectedDateTime = new Date(`${date}T${time}`);
//     const currentDateTime = new Date();

//     if (selectedDateTime <= currentDateTime) {
//       alert("Please select a future date and time for the appointment.");
//       return;
//     }

//     // Check if an appointment already exists for the selected date and time
//     const existingAppointmentResponse = await fetch(
//       `http://localhost:8080/api/appointments/checkAvailability?serviceId=${id}&date=${selectedDateTime.toISOString()}&time=${time}`,
//       {
//         method: "GET",
//       }
//     );

//     if (existingAppointmentResponse.ok) {
//       const existingAppointmentData = await existingAppointmentResponse.json();

//       if (existingAppointmentData.appointments.length > 0) {
//         alert(
//           "Appointment already booked for the selected date and time. Please choose a different time."
//         );
//         return;
//       }
//     } else {
//       console.error(
//         "Error checking existing appointments:",
//         existingAppointmentResponse.statusText
//       );
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8080/api/payment", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: window.localStorage.getItem("UserId"),
//           serviceId: id,
//           date: date,
//           time: time,
//         }),
//       });

//       if (response.status === 200) {
//         const resData = await response.json();

//         const successCallback = () => {
//           handleAppointmentSubmit(resData.data, resData.saveAppointment);
//         };

//         initPayment(resData.data, resData.saveAppointment, successCallback);
//       } else {
//         console.error("Error creating order:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error sending order data:", error);
//     }
//   };

//   // const handleAppointmentSubmit = async (orderData, AppointmentData) => {
//   //   const selectedDateTime = new Date(`${date}T${time}`);
//   //   const currentDateTime = new Date();

//   //   if (selectedDateTime <= currentDateTime) {
//   //     alert("Please select a future date and time for the appointment.");
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch("http://localhost:8080/api/appointments", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({
//   //         userId: window.localStorage.getItem("UserId"),
//   //         serviceId: id,
//   //         date: selectedDateTime.toISOString(),
//   //         time: time,
//   //         paymentId: orderData.id, // Assuming 'id' is the payment ID
//   //       }),
//   //     });

//   //     if (response.ok) {
//   //       console.log("Appointment submitted successfully!");
//   //       navigate("/home");
//   //     } else {
//   //       console.error("Failed to submit appointment:", response.statusText);
//   //     }
//   //   } catch (error) {
//   //     console.error("Error submitting appointment:", error);
//   //   }
//   // };

//   const handleAppointmentSubmit = async (orderData, AppointmentData) => {
//     const selectedDateTime = new Date(`${date}T${time}`);
//     const currentDateTime = new Date();

//     try {
//       // If no existing appointment, submit the new appointment
//       const response = await fetch("http://localhost:8080/api/appointments", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           userId: window.localStorage.getItem("UserId"),
//           serviceId: id,
//           date: selectedDateTime.toISOString(),
//           time: time,
//           paymentId: orderData.id, // Assuming 'id' is the payment ID
//         }),
//       });

//       if (response.ok) {
//         console.log("Appointment submitted successfully!");
//         navigate("/home");
//       } else {
//         console.error("Failed to submit appointment:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error submitting appointment:", error);
//     }
//   };

//   return (
//     <div>
//       <h2>Book Appointment</h2>
//       <form onSubmit={handlePayment}>
//         <label htmlFor="date">Date:</label>
//         <input
//           type="date"
//           id="date"
//           value={date}
//           onChange={(e) => setDate(e.target.value)}
//           required
//         />
//         <br />
//         <label htmlFor="time">Time:</label>
//         <input
//           type="time"
//           id="time"
//           value={time}
//           onChange={(e) => setTime(e.target.value)}
//           required
//         />
//         <br />
//         <label>
//           <input
//             type="checkbox"
//             checked={agreedToTerms}
//             onChange={() => setAgreedToTerms(!agreedToTerms)}
//           />
//           I agree to the terms
//         </label>
//         <br />
//         <button type="submit">Proceed to Payment</button>
//       </form>
//     </div>
//   );
// };

// export default AppointmentForm;

//-------------------------------------------------------------------------------------------------------------------

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import moment from "moment-timezone"; // Import moment-timezone

const AppointmentForm = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

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
    console.log("initPayment--------------------------------------------");
    await loadRazorpayScript();
    console.log("after loadRazorpayScript-------------");
    const amount_to_pay = AppointmentData.book_cost * 100;

    const options = {
      key: process.env.REACT_APP_API_KEY,
      amount: amount_to_pay,
      currency: data.currency,
      name: `Package: ${AppointmentData.packageName}`,
      description: "Testing",
      image: AppointmentData.packImage,
      order_id: data.id,
      handler: async (response) => {
        try {
          const newResponse = {
            response,
            AppointmentData,
          };
          console.log("newResponse in going verify------------");
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
          paymentId: orderData.id, // Assuming 'id' is the payment ID
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

  return (
    <div>
      <h2>Book Appointment</h2>
      <form onSubmit={handlePayment}>
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <br />
        <label htmlFor="time">Time:</label>
        <input
          type="time"
          id="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
        <br />
        <label>
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={() => setAgreedToTerms(!agreedToTerms)}
          />
          I agree to the terms
        </label>
        <br />
        <button type="submit">Proceed to Payment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
