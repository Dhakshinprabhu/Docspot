const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");
const userSchema = require("../schemas/userModel");
const fs = require("fs");
const path = require("path");

// =======================
// Update Doctor Profile
// =======================
const updateDoctorProfileController = async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "userId is required" });
    }

    const doctor = await docSchema.findOneAndUpdate(
      { userId },
      updateData,
      {
        new: true,          // return updated doc
        runValidators: true // respect schema validation
      }
    );

    if (!doctor) {
      return res
        .status(404)
        .send({ success: false, message: "Doctor profile not found" });
    }

    return res.status(200).send({
      success: true,
      data: doctor,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

// =======================
// Get All Doctor Appointments
// =======================
const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    // Frontend sends `params: { userId }` in a GET call
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
      return res
        .status(400)
        .send({ success: false, message: "userId is required" });
    }

    const doctor = await docSchema.findOne({ userId });

    if (!doctor) {
      return res
        .status(404)
        .send({ success: false, message: "Doctor not found" });
    }

    const allAppointments = await appointmentSchema.find({
      doctorId: doctor._id,
    });

    return res.status(200).send({
      message: "All the appointments are listed below.",
      success: true,
      data: allAppointments,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

// =======================
// Handle Appointment Status
// =======================
const handleStatusController = async (req, res) => {
  try {
    const { userid, appointmentId, status } = req.body;

    if (!userid || !appointmentId || !status) {
      return res.status(400).send({
        success: false,
        message: "userid, appointmentId and status are required",
      });
    }

    const appointment = await appointmentSchema.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .send({ success: false, message: "Appointment not found" });
    }

    const user = await userSchema.findById(userid);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    if (!Array.isArray(user.notification)) {
      user.notification = [];
    }

    user.notification.push({
      type: "status-updated",
      message: `Your appointment is ${status}`,
      createdAt: new Date(),
    });

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

// =======================
// Document Download
// =======================
const documentDownloadController = async (req, res) => {
  const appointId = req.query.appointId;

  if (!appointId) {
    return res
      .status(400)
      .send({ success: false, message: "appointId is required" });
  }

  try {
    const appointment = await appointmentSchema.findById(appointId);

    if (!appointment) {
      return res
        .status(404)
        .send({ message: "Appointment not found", success: false });
    }

    const documentField = appointment.document;
    const documentPath = documentField && documentField.path;

    if (!documentPath || typeof documentPath !== "string") {
      return res
        .status(404)
        .send({ message: "Document path is invalid", success: false });
    }

    const absoluteFilePath = path.join(__dirname, "..", documentPath);

    fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(404)
          .send({ message: "File not found", success: false });
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(absoluteFilePath)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = fs.createReadStream(absoluteFilePath);

      fileStream.on("error", (error) => {
        console.log(error);
        return res.status(500).send({
          message: "Error reading the document",
          success: false,
        });
      });

      fileStream.pipe(res);

      fileStream.on("end", () => {
        console.log("File download completed.");
      });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something went wrong", success: false });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
};
