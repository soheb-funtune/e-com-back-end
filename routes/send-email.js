const nodemailer = require("nodemailer");
const EmailSubscribe = require("../models/EmailSubscribe");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "sohebs5050@gmail.com",
    pass: process.env.GMAIL_PASS_FOR_NODEMAILER,
  },
});

exports.sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: "sohebs5050@gmail.com",
    to,
    subject,
    text,
  };

  try {
    let emailSub = await EmailSubscribe.create({ email: to });
    emailSub = await emailSub.save();
    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
    res.send({ msg: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error sending email", msg: "req failed" });
  }
};
