const express = require("express");
const app = express();

require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://stark-plains-53456.herokuapp.com/"
  );
  res.setHeader(
    "Access-Control-Request-Method",
    "https://stark-plains-53456.herokuapp.com/"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Expose-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  } else {
    return next();
  }
});

app.get("/", function (req, res) {
  res.render("running...");
});

app.post("/send_mail", cors(), async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    to: req.body.email,
    subject: `Reminder: ${req.body.taskName} due soon...`,
    html: `<div>
        <h3>Dear ${req.body.name},</h3>
        <br></br>
        <body>The above mentioned task is due <label style="color:red">${req.body.date}</label> 
              at <label style="color:red">${req.body.time}</label> </body>
        <br></br>
        <br></br>
        <div>Regards,</div>
        <div><h3>Team TaskGo</h3></div>
        <img src="cid:email-signature" />
      </div>`,
    attachments: [
      {
        filename: "email-signature.png",
        path: "./email-signature.png",
        cid: "email-signature", //same cid value as in the html img src
      },
    ],
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
