import { useEffect, useState } from "react";
import { firebase } from "@firebase/app";
import { AiOutlineDelete } from "react-icons/ai";

function TaskHistory() {
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
        setTasksState(doc.data().history);
      } else {
        setTasksState([]);
      }
      // confirms that data has been loaded
      setLoaded(true);
    });
  }, []);

  if (loaded) {
    return <TaskList tasks={task} setTasks={setTasks} />;
  } else {
    return null;
  }
}

function TaskList(props) {
  const { tasks, setTasks } = props;

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();

    db.collection("/users").doc(uid).update({ history: tasks });
  }, [tasks]);

  function handleDeleteTask(task, index) {
    const newTask = [...tasks.slice(0, index), ...tasks.slice(index + 1)];

    setTasks(newTask);
  }

  return (
    <div>
      <p><strong>Task History</strong></p>
      <div>
        <table
          style={{
            margin: "0 auto",
            width: "80%",
            textAlign: "left",
            float: "left",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "8%", textAlign: "left" }}>No.</th>
              <th style={{ width: "50%" }}>Task</th>
              <th style={{ width: "5%" }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td style={{ textAlign: "left" }}>{index + 1}</td>
                <td>{task.description}</td>
                <td style={{ textAlign: "center" }}>
                  <AiOutlineDelete
                    onClick={() => handleDeleteTask(task, index)}
                    className="delete-icon"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskHistory;
