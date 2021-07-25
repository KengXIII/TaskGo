import firebase from "@firebase/app";

export default function initializeSettings() {
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);
  docRef.get().then((doc) => {
    // Checks if user is new
    if (!doc.exists) {
      db.collection("/users")
        .doc(uid)
        .set({
          tasks: [],
          history: [],
          category: [],
          sortView: "deadline",
          settings: [
            {
              email: firebase.auth().currentUser?.email,
              reminderDays: 1,
              historyCleanUp: 7,
              notification: true,
            },
          ],
        });
    }
  });
}
