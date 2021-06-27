const express = require("express");
const app = express();

require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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
  const { google } = require("googleapis");
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    process.env.CLIENTID,
    process.env.CLIENTSECRET,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESHTOKEN,
  });
  const accessToken = oauth2Client.getAccessToken((err, token) => {
    if (err) {
      console.log(err);
    } else {
      return token;
    }
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.USER,
      clientId: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      refreshToken: process.env.REFRESHTOKEN,
      accessToken: accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
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
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent at: %s", info.messageId);
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
