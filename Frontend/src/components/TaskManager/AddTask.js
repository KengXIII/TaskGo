import firebase from "@firebase/app";
import SortTask from "./SortTask";
import updateTasks from "./updateTasks";

export default function addTask(
  name,
  priority,
  deadline,
  category,
  description,
  taskId
) {
  var tasks;
  var sortView;
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);
  docRef
    .get()
    .then((doc) => {
      tasks = doc.data().tasks;
      sortView = doc.data().sortView;
      const newTasks = [
        ...tasks.slice(0),
        {
          name: name,
          priority: priority,
          isComplete: false,
          dateCreated: new Date(),
          dateCompleted: "",
          deadline: deadline,
          category: category,
          description: description,
          taskId: taskId,
          interval: false,
        },
      ];

      updateTasks(newTasks);
    })
    .then(() => {
      SortTask(sortView);
    });
}
