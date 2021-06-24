import React, { useState, useEffect } from "react";
import { firebase } from "@firebase/app";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

function TaskManager() {
  const [task, setTasksState] = useState([]);
  // Boolean to check if data has been loaded from firestore
  const [loaded, setLoaded] = useState(false);

  function setTasks(newTasks) {
    setTasksState(newTasks);
  }

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const docRef = db.collection("/users").doc(uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        setTasksState(doc.data().tasks);
      } else {
        setTasksState([]);
      }
      // confirms that data has been loaded
      setLoaded(true);
    });
  }, []);

  // Before rendering the TaskManager component, the data has to be loaded first so that
  // it does not push the wrong updates to firestore.
  if (loaded) {
    return (
      <main>
        <h2>Add Tasks</h2>
        <TaskForm tasks={task} setTasks={setTasks} />
        <h2>Task List</h2>
        <TaskList tasks={task} setTasks={setTasks} />
      </main>
    );
  } else {
    return null;
  }
}

export default TaskManager;
