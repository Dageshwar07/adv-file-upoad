//app create
const express = require("express");
const app = express();
const color = require("colors");
const twilio = require("twilio");
const morgan = require("morgan");

//PORt find krna h
require("dotenv").config();
const PORT = process.env.PORT || 8000;

//middleware add krne h
app.use(express.json());
const fileupload = require("express-fileupload");
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(morgan("dev"));

//db se connect krnah
const db = require("./config/database");
db.connect();

//cloud se connect krna h
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//api route mount krna h
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);

// ____________________________________________________________________________________________________________________________________

// Twilio configuration
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;

const client = twilio(accountSid, authToken);

// Generate random OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Endpoint to send OTP
app.post("/send-otp", (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = generateOTP();

  // Send SMS using Twilio
  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhone,
      to: phoneNumber,
    })
    .then((message) => {
      console.log(message.sid);
      res.json({ success: true, message: "OTP sent successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "Failed to send OTP" });
    });
});
// ------------------------------------------------------------------------------------------------------------

//activate server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`.rainbow);
});
