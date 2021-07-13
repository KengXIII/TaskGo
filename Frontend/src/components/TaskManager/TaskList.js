import firebase from "@firebase/app";
import { Button, Tooltip } from "@material-ui/core";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiMessageSquareDetail, BiSort } from "react-icons/bi";
import { TiTickOutline } from "react-icons/ti";
import updateHistory from "../TaskHistory/updateHistory";
import cancelMail from "./CancelMail";
import TaskForm from "./TaskForm";
import updateTasks from "./updateTasks";

export default function TaskList() {
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sort, sortMode] = useState("deadline");

  // Global variables from Firebase
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();

  // Realtime data from firestore
  useEffect(() => {
    const docRef = db.collection("/users").doc(uid);
    docRef.onSnapshot((doc) => {
      var sortingMethod;
      console.log(sort);
      switch (sort) {
        case "deadline":
          sortingMethod = (task1, task2) => {
            return task1.deadline - task2.deadline;
          };

          break;
        case "priority":
          sortingMethod = (task1, task2) => {
            return task1.priority - task2.priority;
          };

          break;
        case "category":
          sortingMethod = (task1, task2) => {
            if (task1.category <= task2.category) {
              return -1;
            } else {
              return 1;
            }
          };

          break;
        default:
          console.log("Should not come here...");
          break;
      }

      const processed = doc.data().tasks.sort(sortingMethod);
      setTasks(processed);
      setHistory(doc.data().history);
    });
    setLoaded(true);
  }, []);

  const handleSort = () => {
    console.log(sort);
    if (sort === "deadline") {
      sortMode("priority");
      const byPriority = tasks.sort((task1, task2) => {
        return task1.priority - task2.priority;
      });
      setTasks(byPriority);
    } else if (sort === "priority") {
      sortMode("category");
      const byCategory = tasks.sort((task1, task2) => {
        if (task1.category <= task2.category) {
          return -1;
        } else {
          return 1;
        }
      });
      setTasks(byCategory);
    } else {
      sortMode("deadline");
      const byDeadline = tasks.sort((task1, task2) => {
        return task1.deadline - task2.deadline;
      });
      setTasks(byDeadline);
    }
  };

  // Toggles between completed and incomplete.
  function handleTaskToggle(toggledTaskIndex) {
    if (busy) {
      console.log("lagged");
      window.setTimeout(handleTaskToggle, 50);
    } else {
      setBusy(true);
      console.log("task started");
      // Get the name of the cron job
      const taskId = tasks[toggledTaskIndex].taskId;

      //Add task at the front of array in history
      const newHistory = [
        {
          name: tasks[toggledTaskIndex].name,
          priority: tasks[toggledTaskIndex].priority,
          isComplete: true,
          dateCreated: tasks[toggledTaskIndex].dateCreated,
          dateCompleted: new Date(),
          deadline: tasks[toggledTaskIndex].deadline,
          description: tasks[toggledTaskIndex].description,
          taskId: tasks[toggledTaskIndex].taskId,
        },
        ...history.slice(0),
      ];

      setHistory(newHistory);
      updateHistory(newHistory);

      //Remove the task from local array
      const newTasks = [
        ...tasks.slice(0, toggledTaskIndex),
        ...tasks.slice(toggledTaskIndex + 1),
      ];
      //Update array with new elements
      setTasks(newTasks);
      updateTasks(newTasks);

      // Cancel the cron email job
      cancelMail(taskId);
      setBusy(false);
      console.log("task ended");
    }
  }

  function handleDeleteTask(index) {
    if (busy) {
      console.log("lagged");
      window.setTimeout(handleDeleteTask, 50);
    } else {
      setBusy(true);
      console.log("task started");
      // Cancel Mail
      cancelMail(tasks[index].taskId);

      //Remove the task from local array
      const newTask = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
      //Update array with new elements
      setTasks(newTask);
      updateTasks(newTask);
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
          Task List
          <TaskForm />
        </h2>

        <div>
          <BiSort onClick={handleSort} />
        </div>

        {tasks.length <= 0 ? (
          <p>Go and have fun for today!</p>
        ) : (
          <div
            style={{ display: "flex", marginLeft: "auto", marginRight: "auto" }}
          >
            <table
              style={{
                margin: "0 auto",
                width: "100%",
                textAlign: "left",
                float: "left",
                tableLayout: "fixed",
                borderCollapse: "separate",
                borderSpacing: "0 3px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: "0.25%" }}></th>
                  <th style={{ width: "30%", paddingLeft: "5px" }}>Task</th>
                  <th style={{ width: "4%" }}></th>
                  <th style={{ width: "8%" }}>Category</th>
                  <th style={{ width: "9%" }}>Deadline</th>
                  <th style={{ width: "3%" }}></th>
                  <th style={{ width: "3%" }}></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr
                    style={
                      task.deadline.toDate() < new Date()
                        ? { backgroundColor: "#ff7a7a50" }
                        : {}
                    }
                    key={index}
                    className="scroll-list"
                  >
                    <td
                      style={
                        task.priority === "1"
                          ? { backgroundColor: "darkorange" }
                          : task.priority === "2"
                          ? { backgroundColor: "#ecd540" }
                          : { backgroundColor: "limegreen" }
                      }
                    ></td>
                    <td style={{ wordWrap: "break-word", paddingLeft: "5px" }}>
                      {task.name}
                    </td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}>
                      <Tooltip
                        title={task.description}
                        interactive
                        placement="right"
                      >
                        <Button>
                          <BiMessageSquareDetail />
                        </Button>
                      </Tooltip>
                    </td>
                    <td
                      style={{
                        color: "darkblue",
                        wordWrap: "break-word",
                        paddingRight: "10px",
                      }}
                    >
                      {task.category}
                    </td>
                    <td>
                      {`${task.deadline.toDate().toDateString().slice(0, 10)}
                  ${task.deadline.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                    </td>

                    <td style={{ textAlign: "center", cursor: "pointer" }}>
                      <TiTickOutline onClick={() => handleTaskToggle(index)} />
                    </td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}>
                      <AiOutlineDelete
                        onClick={() => handleDeleteTask(index)}
                        className="delete-icon"
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
