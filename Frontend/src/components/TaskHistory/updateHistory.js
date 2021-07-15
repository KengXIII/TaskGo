import firebase from "@firebase/app";

export default function updateHistory(newHistory) {
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);

  docRef.update({ history: newHistory });
}
