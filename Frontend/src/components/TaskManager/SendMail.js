import axios from "axios";
import { firebase } from "@firebase/app";

export default function sendMailReminder(taskId, deadline, taskName) {
  const dueDate = new Date(deadline);
  const emailPrior = 60 * 1000;
  const emailDate = new Date(dueDate.getTime() - emailPrior);
  axios
    //.post("https://stark-plains-53456.herokuapp.com/send_mail", {
    .post("http://localhost:4000/send_mail", {
      taskName: taskName,
      date: dueDate.toDateString(),
      time: `${dueDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      name: firebase.auth().currentUser.displayName,
      email: firebase.auth().currentUser.email,
      emailTime: emailDate,
      jobName: taskId,
    })
    .then((res) => {
      res.status === 200
        ? console.log("Message scheduled!")
        : console.log("Error occured");
    })
    .catch((err) => console.error(err));
}
