const express = require("express");
require("dotenv").config();
const cors = require("cors");
const nodemailer = require("nodemailer");

// Cron manager with dictionary of cron jobs
const schedule = require("node-schedule");
const cron = require("node-cron");

// Axios package
const axios = require("axios").default;

// Firebase SDK
var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert({
    project_id: process.env.PROJECTID,
    private_key: process.env.PRIVATEKEY.replace(/\\n/g, "\n").replace(
      /_/g,
      " "
    ),
    client_email: process.env.CLIENTEMAIL,
  }),
  databaseURL: process.env.DATABASEURL,
});

var db = admin.firestore();

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
  console.log("Email scheduled");
  res.end();
});

app.post("/cancel_mail", (req, res) => {
  try {
    schedule.scheduledJobs[req.body.taskId].cancel();
    console.log("Success: Email cancelled");
  } catch (TypeError) {
  } finally {
    res.end();
  }
});

app.post("/interval_task", (req, res) => {
  const uid = req.body.uid;
  const newTask = req.body.task;
  const interval = req.body.interval;
  const intervalEnd = req.body.intervalEnd;
  const count = req.body.count;
  const deadline = new Date(newTask.deadline);
  const name = req.body.name;
  const email = req.body.email;
  console.log(
    `-------------------${uid} added interval job -----------------------`
  );

  var docRef = db.collection("/users").doc(uid);

  docRef.get().then((doc) => {
    const tasks = doc.data().tasks;

    const newTasks = [
      ...tasks.slice(0),
      {
        name: newTask.name,
        priority: newTask.priority,
        isComplete: false,
        dateCreated: new Date(),
        dateCompleted: "",
        deadline: deadline,
        category: newTask.category,
        description: newTask.description,
        taskId: newTask.taskId,
        interval: true,
      },
    ];
    docRef.update({ tasks: newTasks });
  });

  // Scheduling the email
  const emailPrior = 86400000;
  const emailDate = new Date(deadline.getTime() - emailPrior);

  axios.post("http://localhost:4000/send_mail", {
    taskName: newTask.name,
    date: deadline.toDateString(),
    time: `${deadline.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`,
    name: name,
    email: email,
    emailTime: emailDate,
    taskId: newTask.taskId,
  });

  // Schedule next task only if the deadline of next task is
  // before intervalEnd
  if (new Date(deadline.getTime() + interval) < new Date(intervalEnd)) {
    console.log("scheduling next", new Date(deadline.getTime() - 86400000));
    const createTime = new Date().toISOString();

    // Schedule task 1 day before the previous task is due
    schedule.scheduleJob(
      `${uid}${createTime}`,
      new Date(deadline.getTime() - 86400000),
      function () {
        axios.post("http://localhost:4000/interval_task", {
          uid: uid,
          task: {
            name: newTask.name,
            priority: newTask.priority,
            isComplete: false,
            dateCreated: new Date(),
            dateCompleted: "",
            deadline: new Date(deadline.getTime() + interval),
            category: newTask.category,
            description: newTask.description,
            taskId: `${uid}${createTime}`,
            interval: true,
          },
          interval: interval,
          intervalEnd: intervalEnd,
          count: count + 1,
          name: name,
          email: email,
        });
      }
    );
  }

  res.end();
});

// Module used to clean up all user's history at 00:00hrs everyday
cron.schedule("0 0 0 * * *", function () {
  console.log(
    `Running daily history clean-up at ${new Date(Date.now()).toDateString()}\n`
  );
  db.collection("/users")
    .get()
    .then(
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id);
          var history = doc.data().history;
          var current = new Date();
          var newHistory = history.filter(
            (task) =>
              new Date(current.getTime() - 604800000) <
              task.dateCompleted.toDate()
          );
          var originalLength = history.length;
          var newLength = newHistory.length;
          var numberRemoved = originalLength - newLength;
          if (numberRemoved > 0) {
            console.log(`***${numberRemoved} task(s) removed from history***`);
          }
          doc.ref.update({ history: newHistory });
        });
      },
      (err) => {
        console.log(`Encountered error: ${err}`);
      }
    )
    .then(() => console.log(`\ndaily history clean-up finished`));
});

// For local development
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
