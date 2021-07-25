import axios from "axios";
import { firebase } from "@firebase/app";
import sendMailReminder from "./SendMail";

export default function addIntervaltask(
  name,
  priority,
  deadline,
  category,
  description,
  taskId,
  interval,
  intervalEnd
) {
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);

  var notification;
  var email;

  docRef.get().then((doc) => {
    notification = doc.data().settings[0].notification;
    email = doc.data().settings[0].email;
    console.log(notification);
  });

  const newTask = {
    name: name,
    priority: priority,
    isComplete: false,
    dateCreated: new Date(),
    dateCompleted: "",
    deadline: deadline,
    category: category,
    description: description,
    taskId: taskId,
    interval: true,
  };

  axios.post("https://stark-plains-53456.herokuapp.com/interval_task", {
    task: newTask,
    uid: firebase.auth().currentUser?.uid,
    interval: interval,
    intervalEnd: intervalEnd,
    count: 1,
    name: firebase.auth().currentUser.displayName,
  });

  if (notification) {
    sendMailReminder(taskId, deadline, name, email);
  }
}
