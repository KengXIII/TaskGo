import React, { useState, useEffect } from "react";
import { firebase } from "@firebase/app";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { AiOutlineDelete } from "react-icons/ai";

function TaskManager() {
  const [tasks, setTasksState] = useState([]);
  const [history, setHistoryState] = useState([]);

  // Boolean to check if data has been loaded from firestore
  const [loaded, setLoaded] = useState(false);

  function setTasks(newTasks) {
    setTasksState(newTasks);
  }

  function setHistory(newTasks) {
    setHistoryState(newTasks);
  }

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    const docRef = db.collection("/users").doc(uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        setTasksState(doc.data().tasks);
        setHistoryState(doc.data().history);
      } else {
        setTasksState([]);
        setHistoryState([]);
      }
      setLoaded(true);
    });
  }, []);

  // Before rendering the TaskManager component, the data has to be loaded first so that
  // it does not push the wrong updates to firestore.
  if (loaded) {
    return (
      <main>
        <h2>Add Tasks</h2>
        <TaskForm tasks={tasks} setTasks={setTasks} />
        <h2>Task List</h2>
        <TaskList
          history={history}
          setHistory={setHistory}
          tasks={tasks}
          setTasks={setTasks}
        />
      </main>
    );
  } else {
    return null;
  }
}

export default TaskManager;
