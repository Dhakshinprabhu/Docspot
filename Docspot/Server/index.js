const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./config/connectToDB");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

const app = express();

// env + DB
dotenv.config();
connectToDB();
const PORT = process.env.PORT || 8001;

// core middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctor", doctorRoutes);



// debug: just to confirm server online
app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// error handler LAST
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR HANDLER:", err);
  res
    .status(500)
    .json({ message: "Something went wrong", success: false });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
