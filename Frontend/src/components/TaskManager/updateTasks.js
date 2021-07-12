import firebase from "@firebase/app";

export default function updateTasks(tasks) {
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);

  docRef.get().then((doc) => {
    docRef.update({ tasks: tasks });
  });
}
