const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Appointment = require("../models/appointments");
const Service = require("../models/Service");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Received payment creation request:", req.body);

    const AppointmentData = req.body;
    const service = await Service.findById(AppointmentData.serviceId);

    if (!service) {
      console.error("Service not found");
      return res.status(404).json({ message: "Service not found" });
    }

    const amount_to_pay = service.charges * 100; 

    console.log(`Amount to pay: ${amount_to_pay}`);

    const instance = new Razorpay({
      key_id: process.env.REACT_APP_API_KEY,
      key_secret: process.env.REACT_APP_API_SECRET_KEY,
    });

    const options = {
      amount: amount_to_pay,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, async (error, order) => {
      if (error) {
        console.error("Error creating Razorpay order:", error);
        return res
          .status(500)
          .json({ message: "Error creating Razorpay order" });
      }

      console.log("Razorpay order created:", order);

      res.status(200).json({ data: order, saveAppointment: AppointmentData });
    });
  } catch (error) {
    console.error("Internal Server Error fetching service:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error fetching service" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { response, AppointmentData } = req.body;

    console.log("body in verify : ", req.body);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      response;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedsign = crypto
      .createHmac("sha256", process.env.REACT_APP_API_SECRET_KEY)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedsign) {
      const saveAppointment = new Appointment({
        userId: AppointmentData.userId,
        serviceId: AppointmentData.serviceId,
        date: AppointmentData.date,
        time: AppointmentData.time,
        status: "pending", 
        paymentId: razorpay_payment_id,
      });

      saveAppointment.save();

      console.log("Payment verified successfully");

      return res.status(200).json({ message: "Payment verified successfully" });
    }
  } catch (error) {
    console.error("Internal Server Error:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

router.post("/:id/refund", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    console.log("appointment-------" , appointment);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    if (appointment.status !== "rejected") {
      return res
        .status(400)
        .json({
          error: "Refund can only be initiated for rejected appointments.",
        });
    }

    // Fetch payment details associated with the appointment
    const paymentId = appointment.paymentId;

    const instance = new Razorpay({
      key_id: process.env.REACT_APP_API_KEY,
      key_secret: process.env.REACT_APP_API_SECRET_KEY,
    });

    // Initiate refund using Razorpay API
    const refund = await instance.payments.refund(paymentId, {
      amount: appointment.amount, 
      speed: "optimum", 
    });

    console.log("Refund response:", refund);

    appointment.status = "refunded";
    await appointment.save();

    res.status(200).json({ message: "Refund initiated successfully." });
  } catch (error) {
    console.error("Error initiating refund:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});





module.exports = router;
