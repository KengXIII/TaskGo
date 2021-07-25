import { useEffect, useState } from "react";
import { firebase } from "@firebase/app";
import { AiOutlineDelete, AiOutlineHistory } from "react-icons/ai";

import updateHistory from "./updateHistory";
import addTask from "../TaskManager/AddTask";
import TaskHistoryInfo from "./TaskHistoryInfo.js";
import { BiMessageSquareDetail } from "react-icons/bi";
import { Tooltip, Button } from "@material-ui/core";

function TaskHistory() {
  const [history, setHistory] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();

  // Listen for updates in our database
  useEffect(() => {
    const docRef = db.collection("/users").doc(uid);
    docRef.onSnapshot((doc) => {
      setHistory(doc.data().history);
    });
    setLoaded(true);
  }, [db, uid]);

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
      addTask(
        task.name,
        task.priority,
        task.deadline.toDate(),
        task.category,
        task.description,
        task.taskId
      );

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
          <TaskHistoryInfo
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: "1rem",
              fontSize: "medium",
            }}
          />
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#E2E3F4",
            padding: "5px 0",
            fontSize: "0.8em",
          }}
        >
          <div style={{ flex: "0.5%" }}></div>
          <div style={{ flex: "40%" }}>
            <strong>Task Name</strong>
          </div>
          <div style={{ flex: "10%" }}>
            <strong>Description</strong>
          </div>
          <div style={{ flex: "20%" }}>
            <strong>Category</strong>
          </div>
          <div style={{ flex: "20%" }}>
            <strong>Deadline</strong>
          </div>
          <div style={{ flex: "20%" }}>
            <strong>Date Completed</strong>
          </div>
          <div style={{ flex: "6%" }}></div>
          <div style={{ flex: "4%" }}></div>
        </div>

        {history.length <= 0 ? (
          <p>You have no relevant tasks!</p>
        ) : (
          <div style={{ overflowY: "auto" }}>
            {history.map((task, index) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignContent: "center",
                  borderBottom: "0.5px solid lightgrey",
                }}
              >
                <div
                  style={
                    task.priority === "1"
                      ? {
                          backgroundColor: "darkorange",
                          flex: "0.5%",
                          padding: "10px 0",
                        }
                      : task.priority === "2"
                      ? {
                          backgroundColor: "#ecd540",
                          flex: "0.5%",
                          padding: "10px 0",
                        }
                      : {
                          backgroundColor: "limegreen",
                          flex: "0.5%",
                          padding: "10px 0",
                        }
                  }
                ></div>
                <div style={{ flex: "40%", padding: "10px 0" }}>
                  {task.name}
                </div>
                <div
                  style={{
                    flex: "10%",
                    padding: "10px 0",
                  }}
                >
                  <Tooltip
                    title={task.description}
                    interactive
                    placement="right"
                  >
                    <Button>
                      <BiMessageSquareDetail />
                    </Button>
                  </Tooltip>
                </div>
                <div style={{ flex: "20%", padding: "10px 0" }}>
                  {task.category}
                </div>
                <div style={{ flex: "20%", padding: "10px 0" }}>
                  {`${task.deadline.toDate().toDateString().slice(0, 10)}
                    ${task.deadline.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </div>

                <div style={{ flex: "20%", padding: "10px 0" }}>
                  {`${task.dateCompleted.toDate().toDateString().slice(0, 10)}
                    ${task.dateCompleted.toDate().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: "6%",
                    justifyContent: "space-between",
                    padding: "10px 0",
                  }}
                >
                  <AiOutlineDelete
                    fontSize="1.2em"
                    onClick={() => handleDeleteTask(index)}
                    className="delete-icon"
                  />
                  <AiOutlineHistory
                    fontSize="1.2em"
                    onClick={() => handleRevert(task, index)}
                    className="revert-icon"
                  />
                </div>
                <div style={{ display: "flex", flex: "4%" }}></div>
              </div>
            ))}
          </div>
        )}

        {/*history.length <= 0 ? (
          "You have no relevant tasks!"
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
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )*/}
      </main>
    );
  }
}

export default TaskHistory;
