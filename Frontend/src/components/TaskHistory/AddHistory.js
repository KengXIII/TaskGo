import firebase from "@firebase/app";
import updateHistory from "./updateHistory";

export default function AddHistory(
  name,
  priority,
  dateCreated,
  deadline,
  category,
  description,
  taskId
) {
  var history;
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);
  docRef.get().then((doc) => {
    history = doc.data().history;
    const newHistory = [
      {
        name: name,
        priority: priority,
        isComplete: true,
        dateCreated: dateCreated,
        dateCompleted: new Date(),
        deadline: deadline,
        category: category,
        description: description,
        taskId: taskId,
      },
      ...history.slice(0),
    ];

    updateHistory(newHistory);
  });
}
