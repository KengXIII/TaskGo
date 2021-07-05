const express = require("express");
require("dotenv").config();
const cors = require("cors");
const nodemailer = require("nodemailer");

// Cron manager with dictionary of cron jobs
const schedule = require("node-schedule");

// Server uses express.js
const app = express();

//Cors is used for security
app.use(cors());
app.use(express.json());

// Root path message should show Server Live if it works
app.get("/", (req, res) => {
  res.send(`Server live! at: ${new Date(Date.now())}`);
});

app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    //"https://task-go-kengxiii.vercel.app"
    "localhost:3000/dashboard"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/send_mail", cors(), (req, res) => {
  const taskId = req.body.taskId;

  //Cron job is created. (Key: taskId, Entry: cronjob)
  schedule.scheduleJob(taskId, req.body.emailTime, function () {
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
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: accessToken,
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
  console.log("Job scheduled");
  res.end();
});

app.post("/cancel_mail", (req, res) => {
  try {
    schedule.scheduledJobs[req.body.taskId].cancel();
    console.log("Success: Email cancelled");
  } catch (TypeError) {
    console.log("Error: cron job not found");
  } finally {
    res.end();
  }
});

// For local development
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
