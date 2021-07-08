import firebase from "@firebase/app";

export default function updateTasks(tasks) {
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);

  docRef.get().then((doc) => {
    if (doc.exists) {
      db.collection("/users").doc(uid).update({ tasks: tasks });
    } else {
      db.collection("/users").doc(uid).set({ tasks: tasks });
    }
  });
}
