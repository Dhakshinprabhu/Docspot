const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const userSchema = require("../schemas/userModel");
const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");

// ==========================
// Register User
// ==========================
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const newUser = new userSchema(req.body);
    await newUser.save();

    return res.status(201).send({ message: "Register Success", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

// ==========================
// Login User
// ==========================
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid email or password", success: false });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "1d" }
    );

    // don't leak password
    user.password = undefined;

    return res.status(200).send({
      message: "Login success successfully",
      success: true,
      token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: `${error.message}` });
  }
};

// ==========================
// Auth Controller (Get User by ID)
// ==========================
const authController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });

    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }

    return res.status(200).send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "auth error", success: false, error });
  }
};

// ==========================
// Doctor Registration (from User)
// ==========================
const docController = async (req, res) => {
  try {
    const { doctor, userId } = req.body;

    const newDoctor = new docSchema({
      ...doctor,
      userId: userId.toString(),
      status: "pending",
    });
    await newDoctor.save();

    const adminUser = await userSchema.findOne({ type: "admin" });

    if (!adminUser) {
      console.log("Admin user not found.");
      return res.status(404).send({
        success: false,
        message: "Admin user not found",
      });
    }

    const notification = adminUser.notification || [];
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.fullName} has applied for doctor registration`,
      data: {
        userId: newDoctor._id,
        fullName: newDoctor.fullName,
        onClickPath: "/admin/doctors",
      },
    });

    await userSchema.findByIdAndUpdate(adminUser._id, { notification });

    return res.status(201).send({
      success: true,
      message: "Doctor Registration request sent successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({
      success: false,
      message: "Error while applying",
      error: error.message,
    });
  }
};

// ==========================
// Get All Notifications (mark as read)
// ==========================
const getallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });

    const seennotification = user.seennotification || [];
    const notification = user.notification || [];

    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;

    const updatedUser = await user.save();

    return res.status(200).send({
      success: true,
      message: "All notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "unable to fetch", success: false, error });
  }
};

// ==========================
// Delete All Notifications
// ==========================
const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ _id: req.body.userId });

    user.notification = [];
    user.seennotification = [];

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    return res.status(200).send({
      success: true,
      message: "notification deleted",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "unable to delete", success: false, error });
  }
};

// ==========================
// Get All Approved Doctors (for user view)
// ==========================
const getAllDoctorsControllers = async (req, res) => {
  try {
    const docUsers = await docSchema.find({ status: "approved" });
    return res.status(200).send({
      message: "doctor Users data list",
      success: true,
      data: docUsers,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false, error });
  }
};

// ==========================
// Book Appointment (User -> Doctor)
// ==========================
const appointmentController = async (req, res) => {
  try {
    let { userInfo, doctorInfo } = req.body;

    // userInfo and doctorInfo are JSON strings in your current setup
    try {
      userInfo = typeof userInfo === "string" ? JSON.parse(userInfo) : userInfo;
      doctorInfo =
        typeof doctorInfo === "string" ? JSON.parse(doctorInfo) : doctorInfo;
    } catch (parseError) {
      return res.status(400).send({
        success: false,
        message: "Invalid userInfo or doctorInfo format",
      });
    }

    if (!req.body.userId || !req.body.doctorId || !req.body.date) {
      return res.status(400).send({
        success: false,
        message: "userId, doctorId and date are required",
      });
    }

    let documentData = null;
    if (req.file) {
      documentData = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
      };
    }

    const newAppointment = new appointmentSchema({
      userId: req.body.userId,
      doctorId: req.body.doctorId,
      userInfo,
      doctorInfo,
      date: req.body.date,
      document: documentData,
      status: "pending",
    });

    await newAppointment.save();

    // Notify doctor (user linked to doctor)
    const doctorUser = await userSchema.findOne({ _id: doctorInfo.userId });

    if (doctorUser) {
      if (!Array.isArray(doctorUser.notification)) {
        doctorUser.notification = [];
      }

      doctorUser.notification.push({
        type: "New Appointment",
        message: `New Appointment request from ${userInfo.fullName}`,
      });

      await doctorUser.save();
    }

    return res.status(200).send({
      message: "Appointment book successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false, error });
  }
};

// ==========================
// Get All User Appointments (for /user/getuserappointments)
// ==========================
const getAllUserAppointments = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "userId is required",
      });
    }

    // Fetch all appointments for this user
    const allAppointments = await appointmentSchema.find({ userId });

    // Collect doctor ids
    const doctorIds = allAppointments.map((appointment) => appointment.doctorId);

    const doctors = await docSchema.find({
      _id: { $in: doctorIds },
    });

    // Attach doctor name to each appointment
    const appointmentsWithDoctor = allAppointments.map((appointment) => {
      const doctor = doctors.find(
        (doc) => doc._id.toString() === appointment.doctorId.toString()
      );
      const docName = doctor ? doctor.fullName : "";
      return {
        ...appointment.toObject(),
        docName,
      };
    });

    return res.status(200).send({
      message: "All the appointments are listed below.",
      success: true,
      data: appointmentsWithDoctor,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false, error });
  }
};

// ==========================
// Get Docs for User (user.documents)
// ==========================
const getDocsController = async (req, res) => {
  try {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "userId is required",
      });
    }

    const user = await userSchema.findOne({ _id: userId });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const allDocs = user.documents;

    if (!allDocs || allDocs.length === 0) {
      return res.status(200).send({
        message: "No documents",
        success: true,
        data: [],
      });
    }

    return res.status(200).send({
      message: "All documents are listed below.",
      success: true,
      data: allDocs,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "something went wrong", success: false, error });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
};
