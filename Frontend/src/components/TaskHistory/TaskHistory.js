import { useEffect, useState } from "react";
import { firebase } from "@firebase/app";
import { AiOutlineDelete } from "react-icons/ai";
import { GrRevert } from "react-icons/gr";
import sendMailReminder from "../TaskManager/SendMail";
import updateHistory from "./updateHistory";
import updateTasks from "../TaskManager/updateTasks";

function TaskHistory() {
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();

  // Listen for updates in our database
  useEffect(() => {
    const docRef = db.collection("/users").doc(uid);
    docRef.onSnapshot((doc) => {
      setTasks(doc.data().tasks);
      setHistory(doc.data().history);
    });
    setLoaded(true);
  }, []);

  function handleDeleteTask(index) {
    if (busy) {
      console.log("lagged");
      window.setTimeout(handleDeleteTask, 50);
    } else {
      setBusy(true);
      console.log("task started");
      const newTask = [...history.slice(0, index), ...history.slice(index + 1)];
      setHistory(newTask);
      updateHistory(newTask);
      setBusy(false);
      console.log("task ended");
    }
  }

  function handleRevert(task, index) {
    if (busy) {
      console.log("lagged");
      window.setTimeout(handleRevert, 50);
    } else {
      setBusy(true);
      console.log("task started");
      // Adds tasks into input array.
      function addTask(array) {
        // This function determines the index of the task to be inserted. Does not work for array of size 0, so be careful.
        function addTaskIndex(low, high) {
          if (low >= high) {
            if (task.deadline - array[low].deadline > 0) {
              return low + 1;
            } else {
              return low;
            }
          } else {
            var mid = Math.floor((low + high) / 2);

            if (task.deadline - array[mid].deadline > 0) {
              return addTaskIndex(mid + 1, high);
            } else {
              return addTaskIndex(low, mid);
            }
          }
        }

        var insertIndex;

        if (array.length === 0) {
          insertIndex = 0;
        } else {
          insertIndex = addTaskIndex(0, array.length - 1);
        }

        const newTasks = [
          ...array.slice(0, insertIndex),
          {
            name: task.name,
            priority: task.priority,
            isComplete: false,
            dateCreated: task.dateCreated,
            dateCompleted: "",
            deadline: task.deadline,
            description: task.description,
            taskId: task.taskId,
          },
          ...array.slice(insertIndex),
        ];

        setTasks(newTasks);
        updateTasks(newTasks);
      }

      // Inserting the task into tasks.
      addTask(tasks);
      sendMailReminder(task.taskId, task.deadline, task.name);

      // Removing from history
      const newHistory = [
        ...history.slice(0, index),
        ...history.slice(index + 1),
      ];
      setHistory(newHistory);
      updateHistory(newHistory);
      setBusy(false);
      console.log("task ended");
    }
  }

  if (!loaded) {
    return null;
  } else {
    return (
      <main>
        <h2>
          <strong>Task History</strong>
        </h2>
        {history.length <= 0 ? (
          "History is empty"
        ) : (
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
                  <th style={{ width: "5%" }}>Revert</th>
                </tr>
              </thead>
              <tbody>
                {history.map((task, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "left" }}>{index + 1}</td>
                    <td>{task.name}</td>
                    <td style={{ textAlign: "center" }}>
                      <AiOutlineDelete
                        onClick={() => handleDeleteTask(index)}
                        className="delete-icon"
                      />
                    </td>
                    <td>
                      <GrRevert
                        onClick={() => handleRevert(task, index)}
                        className="revert-icon"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    );
  }
}

export default TaskHistory;
