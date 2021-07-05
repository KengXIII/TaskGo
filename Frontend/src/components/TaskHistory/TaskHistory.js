import { useEffect } from "react";
import { firebase } from "@firebase/app";
import { AiOutlineDelete } from "react-icons/ai";
import { GrRevert } from "react-icons/gr";
import sendMailReminder from "../TaskManager/SendMail";

function TaskHistory(props) {
  const { history, setHistory, tasks, setTasks } = props;

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("/users").doc(uid).set({ tasks: tasks, history: history });
  }, [tasks, history]);

  function handleDeleteTask(index) {
    const newTask = [...history.slice(0, index), ...history.slice(index + 1)];

    setHistory(newTask);
  }

  function handleRevert(task, index) {
    // Adds tasks into input array.
    function addTask(array) {
      const insertionDeadline = new Date(task.deadline);

      // This function determines the index of the task to be inserted. Does not work for array of size 0, so be careful.
      function addTaskIndex(low, high) {
        if (low >= high) {
          if (insertionDeadline - new Date(array[low].deadline) > 0) {
            return low + 1;
          } else {
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
  }

  if (history.length <= 0) {
    return "History is empty";
  } else {
    return (
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
    );
  }
}

export default TaskHistory;
