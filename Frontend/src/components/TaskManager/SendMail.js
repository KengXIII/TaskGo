import axios from "axios";
import { firebase } from "@firebase/app";

export default function sendMailReminder(taskId, deadline, taskName, email) {
  const emailPrior = 86400000;
  const emailDate = new Date(deadline.getTime() - emailPrior);
  axios
    .post("https://stark-plains-53456.herokuapp.com/send_mail", {
      taskName: taskName,
      date: deadline.toDateString(),
      time: `${deadline.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      name: firebase.auth().currentUser.displayName,
      email: email,
      emailTime: emailDate,
      taskId: taskId,
    })
    .then((res) => {
      res.status === 200
        ? console.log("Message scheduled!")
        : console.log("Error occured");
    })
    .catch((err) => console.error(err));
}
