export default function send() {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "taskgo.official@gmail.com",
      pass: "guanweikengi",
    },
  });

  const mailOptions = {
    from: "taskgo.official@gmail.com",
    to: "taskgo.official@gmail.com",
    subject: "Trial Email",
    text: "This is a test",
  };

  return () => {
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log("Error Occured");
      } else {
        console.log("Email sent!");
      }
    });
  };
}
