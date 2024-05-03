//=====================================================================================================================================================


const express = require("express");
const router = express.Router();
const Appointment = require("../models/appointments");
const nodemailer = require("nodemailer");
const Service = require("../models/Service");
const User = require("../models/User");
const moment = require("moment-timezone");

// Create a new appointment
router.post("/", async (req, res) => {
  try {
    const { userId, serviceId, date, time, paymentId } = req.body;

    const appointment = new Appointment({
      userId,
      serviceId,
      date,
      time,
      status: "pending",
      paymentId,
    });

    await appointment.save();

    sendAppointmentRequestConfirmationEmail(userId, date, time, serviceId);
    sendAppointmentConfirmationEmail(userId, date, time, serviceId);

    res
      .status(201)
      .json({ message: "Appointment created successfully.", appointment });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.get("/checkAvailability", async (req, res) => {
  try {
    const serviceId = req.query.serviceId;
    const date = req.query.date;
    const startTimeString = req.query.time;

    // Check if the start time string is in the correct format
    if (!moment(startTimeString, "HH:mm", true).isValid()) {
      console.error("Invalid start time format:", startTimeString);
      return res.status(400).json({ error: "Invalid start time format." });
    }

    // Convert start time string to Indian time zone
    const startTime = moment
      .tz(startTimeString, "HH:mm", "Asia/Kolkata")
      .toDate();
    console.log("Start Time : ", startTime);

    const service = await Service.findById(serviceId);
    if (!service) {
      console.error("Service not found for serviceId:", serviceId);
      return res.status(404).json({ error: "Service not found." });
    }

    const serviceDuration = service.duration;

    if (isNaN(serviceDuration) || serviceDuration <= 0) {
      console.error("Invalid service duration:", serviceDuration);
      return res.status(400).json({ error: "Invalid service duration." });
    }

    // Calculate end time based on start time and service duration
    const endTime = moment(startTime).add(serviceDuration, "minutes").toDate();
    console.log("endtime : ", endTime);

    // Query for existing appointments that overlap with the selected time slot
    const existingAppointments = await Appointment.find({
      serviceId: serviceId,
      date: date,
      $or: [
        {
          $and: [
            { time: { $gte: startTimeString } },
            { time: { $lt: moment(endTime).format("HH:mm") } },
          ],
        },
        {
          $and: [
            { time: { $lte: startTimeString } },
            {
              time: {
                $gt: moment(startTime)
                  .subtract(serviceDuration, "minutes")
                  .format("HH:mm"),
              },
            },
          ],
        },
      ],
    });

    res.status(200).json({ appointments: existingAppointments });
  } catch (error) {
    console.error("Error checking existing appointments:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

const sendAppointmentRequestConfirmationEmail = async (
  userId,
  date,
  time,
  serviceId
) => {
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      console.error("Service not found for serviceId:", serviceId);
      return;
    }
    const currentUser = await User.findById(userId);
    const currUserEmail = currentUser.email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abhishekjamkar29@gmail.com", 
        pass: "lyqj gmzg dern otbf", 
      },
    });

    const mailOptions = {
      from: "abhishekjamkar29@gmail.com", 
      to: currUserEmail,
      subject: "Appointment Confirmation",
      text: `Your appointment request has been generated successfully.\nDate: ${date}\nTime: ${moment
        .tz(time, "Asia/Kolkata")
        .format("HH:mm")}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      "Email sent from sendAppointmentRequestConfirmationEmail :",
      info.response
    );
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const sendAppointmentConfirmationEmail = async (
  userId,
  date,
  time,
  serviceId
) => {
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      console.error("Service not found for serviceId:", serviceId);
      return;
    }

    const currentUser = await User.findById(userId);
    const currUserEmail = currentUser.email;
    const serviceUserId = service.userId;
    const user = await User.findById(serviceUserId);

    if (!user) {
      console.error("User not found for userId:", serviceUserId);
      return;
    }

    const userEmail = user.email;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abhishekjamkar29@gmail.com",
        pass: "lyqj gmzg dern otbf", 
      },
    });

    const mailOptions = {
      from: "abhishekjamkar29@gmail.com", 
      to: userEmail,
      subject: "Appointment Confirmation",
      text: `Your service has been requested by ${currUserEmail}.\nDate: ${date}\nTime: ${moment
        .tz(time, "Asia/Kolkata")
        .format("HH:mm")}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(
      "Email sent from sendAppointmentConfirmationEmail :",
      info.response
    );
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Fetch appointments for the logged-in user
router.get("/RequestedServices", async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log(userId);

    // Fetch appointments with payment ID prefix "order"
    const appointments = await Appointment.find({
      userId: userId,
      paymentId: /^pay/,
    }).populate({
      path: "serviceId",
      select: "title",
    });

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Delete appointment
router.delete("/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const deletedAppointment = await Appointment.findByIdAndDelete(
      appointmentId
    );

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.status(200).json({ message: "Appointment deleted successfully." });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


// Update appointment status
router.patch("/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.status(200).json({
      message: `Appointment ${status} successfully.`,
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error(`Error updating appointment status:`, error);
    res.status(500).json({ error: "Internal server error." });
  }
});


router.get("/ServiceAppointments", async (req, res) => {
  try {
    const userId = req.query.userId;

    // Fetch all services associated with the user
    const services = await Service.find({ userId });

    // Extract serviceIds from services
    const serviceIds = services.map((service) => service._id);

    // Fetch appointments for the user and serviceIds with payment ID prefix "order"
    const appointments = await Appointment.find({
      serviceId: { $in: serviceIds },
      paymentId: { $regex: /^pay/i }, // Prefix match for payment ID
    })
      .populate({
        path: "userId",
        select: "email",
      })
      .sort("-createdAt"); // Sort by creation date in descending order

    res.status(200).json({ appointments });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Notify and send email
router.post("/notify", async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    // Implement the logic to send the email here using nodemailer
    const appointment = await Appointment.findById(appointmentId).populate({
      path: "userId",
      select: "email",
    });

    if (!appointment || !appointment.userId) {
      return res.status(404).json({ error: "Appointment or user not found." });
    }

    const AppointUserId = appointment.userId;
    const user = await User.findById(AppointUserId);
    // const { email: userEmail, date, time } = user;
    const userEmail = user.email;
    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
    const time = currentDate.toTimeString().split(" ")[0]; // Format as 'HH:mm:ss'

    await sendAppointmentStatusEmail(userEmail, date, time, status);

    res.status(200).json({ message: "Notification sent successfully." });
  } catch (error) {
    console.error("Error notifying and sending email:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Function to send appointment status email
const sendAppointmentStatusEmail = async (userEmail, date, time, status) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abhishekjamkar29@gmail.com",
        pass: "lyqj gmzg dern otbf",
      },
    });

    const mailOptions = {
      from: "abhishekjamkar29@gmail.com",
      to: userEmail,
      subject: `Appointment ${status} Notification`,
      text: `Your appointment status has been updated.\nDate: ${date}\nTime: ${time}\nStatus: ${status}`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending status email:", error);
  }
};

module.exports = router;
