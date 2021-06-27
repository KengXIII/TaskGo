import firebase from "@firebase/app";
import { useEffect } from "react";

function AddTask(props) {
  console.log("Running");
  const { array, setArray, name, deadline, description } = props;
  const insertionDeadline = new Date(deadline);

  /////////////////////////////////////////
  useEffect(() => {
    //Optional chaining: "?." accounts for the case when currentUser is null.
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const docRef = db.collection("/users").doc(uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        db.collection("/users").doc(uid).update({ tasks: array });
      } else {
        db.collection("/users").doc(uid).set({ tasks: array });
      }
    });
  }, [array]);
  ////////////////////////////////////////////////

  // This function determines the index of the task to be inserted. Does not work for array of size 0, so be careful.
  function addTaskIndex(low, high) {
    if (low >= high) {
      if (insertionDeadline - new Date(array[low].deadline) > 0) {
        console.log(insertionDeadline - new Date(array[low].deadline));
        return low + 1;
      } else {
        console.log(insertionDeadline - new Date(array[low].deadline));
        return low;
      }
    } else {
      var mid = Math.floor((low + high) / 2);

      if (insertionDeadline - new Date(array[mid].deadline) > 0) {
        return addTaskIndex(mid + 1, high);
      } else {
        return addTaskIndex(low, mid);
      }
    }
  }

  var index;

  if (array.length === 0) {
    index = 0;
  } else {
    index = addTaskIndex(0, array.length - 1);
  }

  const newTasks = [
    ...array.slice(0, index),
    {
      name: name,
      isComplete: false,
      dateCreated: firebase.firestore.Timestamp.now(),
      deadline: deadline,
      description: description,
    },
    ...array.slice(index),
  ];

  if (!name || /^\s*$/.test(name)) {
    return;
  }

  // setArray(newTasks);
}

export default AddTask;
