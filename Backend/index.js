const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.post("/send_mail", cors(), async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "",
      pass: "",
    },
  });

  await transporter.sendMail({
    from: "taskgo.official@gmail.com",
    to: "taskgo.official@gmail.com",
    subject: "TestMail",
    text: "This is a test mail",
  });
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
