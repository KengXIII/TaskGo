import React, {useState, useEffect} from "react";
import { firebase } from '@firebase/app';
import TaskManager from "./TaskManager";

function TaskOverview() {
    const [task, setTasksState] = useState([]);

    function setTasks(newTasks) {
      setTasksState(newTasks);
    }
  
    useEffect(() => {
      const uid = firebase.auth().currentUser?.uid;
      const db = firebase.firestore();
      const docRef = db.collection("/tasks").doc(uid);
  
      docRef.get().then((doc) => {
        if (doc.exists) {
          setTasksState(doc.data().tasks);
        } else {
          setTasksState([]);
        }
      });
    }, []);

    return (
        <main>
          <TaskManager tasks={task} setTasks={setTasks} />
        </main>
    );
}

export default TaskOverview;