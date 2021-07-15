import firebase from "@firebase/app";

// Toggles the sorting method to apply.
export default function SortTask(choice) {
  // Global variables from Firebase
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();

  var tasks;
  var processed;

  // Realtime data from firestore
  const docRef = db.collection("/users").doc(uid);
  docRef.get().then((doc) => {
    tasks = doc.data().tasks;
    var sortingMethod;
    switch (choice) {
      case "deadline":
        sortingMethod = (task1, task2) => {
          if (task1.deadline === task2.deadline) {
            if (task1.priority === task2.priority) {
              if (task1.name < task2.name) {
                return 1;
              } else {
                return -1;
              }
            } else {
              return task1.priority - task2.priority;
            }
          } else {
            return task1.deadline - task2.deadline;
          }
        };
        break;
      case "priority":
        sortingMethod = (task1, task2) => {
          if (task1.priority === task2.priority) {
            if (task1.deadline === task2.deadline) {
              if (task1.name < task2.name) {
                return -1;
              } else {
                return 1;
              }
            } else {
              return task1.deadline - task2.deadline;
            }
          } else {
            return task1.priority - task2.priority;
          }
        };
        break;
      case "category":
        sortingMethod = (task1, task2) => {
          if (task1.category < task2.category) {
            return -1;
          } else if (task1.category === task2.category) {
            if (task1.deadline === task2.deadline) {
              if (task1.priority === task2.priority) {
                if (task1.name < task2.name) {
                  return -1;
                } else {
                  return 1;
                }
              } else {
                return task1.priority - task2.priority;
              }
            } else {
              return task1.deadline - task2.deadline;
            }
          } else {
            return 1;
          }
        };
        break;
      default:
        console.log("Should not come here...");
        break;
    }
    processed = tasks.sort(sortingMethod);
    docRef.update({ tasks: processed, sortView: choice });
  });
}
