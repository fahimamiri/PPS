const createError = require("http-errors");
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");  // Add this

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "static")));

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/send-message", async (req, res) => {
  const { name, email, message } = req.body;

  // Create transporter object using SMTP (example with Gmail)
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "your.email@gmail.com",        // replace with your Gmail
      pass: "your_app_password",            // replace with your app password
    },
  });

  let mailOptions = {
    from: `"${name}" <${email}>`,
    to: "your.email@gmail.com",              // where you want to receive messages
    subject: "New Contact Form Message",
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render("confirmation", { message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.render("error", { message: "Failed to send email", error });
  }
});

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
