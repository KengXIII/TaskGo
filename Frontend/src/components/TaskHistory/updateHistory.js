import firebase from "@firebase/app";

export default function updateHistory(newHistory) {
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);

  docRef.get().then((doc) => {
    if (doc.exists) {
      db.collection("/users").doc(uid).update({ history: newHistory });
    } else {
      db.collection("/users").doc(uid).set({ history: newHistory });
    }
  });
}
