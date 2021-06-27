const express = require("express");
const app = express();

require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// app.use(
//   cors({
//     origin: "https://task-go-kengxiii.vercel.app",
//     optionsSuccessStatus: 200,
//   })
// );
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Live!");
});

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    "https://task-go-kengxiii.vercel.app"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/send_mail", cors(), (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      type: "login",
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  transporter.sendMail(
    {
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
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent at: %s", info.messageId);
    }
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
