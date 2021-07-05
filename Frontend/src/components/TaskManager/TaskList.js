import firebase from "@firebase/app";
import { Button, Tooltip } from "@material-ui/core";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { TiTickOutline } from "react-icons/ti";
import cancelMail from "./CancelMail";

export default function TaskList(props) {
  const { history, setHistory, tasks, setTasks } = props;

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("/users").doc(uid).update({ tasks: tasks, history: history });
  }, [tasks, history]);

  // Toggles between completed and incomplete.
  function handleTaskToggle(toggledTaskIndex) {
    // Get the name of the cron job
    const taskId = tasks[toggledTaskIndex].taskId;

    //Add task at the front of array in history
    const newHistory = [
      {
        name: tasks[toggledTaskIndex].name,
        priority: tasks[toggledTaskIndex].priority,
        isComplete: true,
        dateCreated: tasks[toggledTaskIndex].dateCreated,
        dateCompleted: firebase.firestore.Timestamp.now(),
        deadline: tasks[toggledTaskIndex].deadline,
        description: tasks[toggledTaskIndex].description,
        taskId: tasks[toggledTaskIndex].taskId,
      },
      ...history.slice(0),
    ];

    setHistory(newHistory);

    //Remove the task from local array
    const newTasks = [
      ...tasks.slice(0, toggledTaskIndex),
      ...tasks.slice(toggledTaskIndex + 1),
    ];
    //Update array with new elements
    setTasks(newTasks);

    // Cancel the cron email job
    cancelMail(taskId);
  }

  function handleDeleteTask(index) {
    // Cancel Mail
    cancelMail(tasks[index].taskId);

    //Remove the task from local array
    const newTask = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
    //Update array with new elements
    setTasks(newTask);
  }

  if (tasks.length <= 0) {
    return <p>Go and have fun for today!</p>;
  } else {
    return (
      <div style={{ display: "flex", marginLeft: "auto", marginRight: "auto" }}>
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
                  new Date(task.deadline) < Date.now()
                    ? { backgroundColor: "#ff7a7a50" }
                    : {}
                }
                key={index}
                className="scroll-list"
              >
                <td
                  style={
                    new Date(task.deadline) < Date.now()
                      ? { backgroundColor: "#F3F5F8" }
                      : task.priority === "1"
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
                  {task.description}
                </td>
                <td>
                  {`${new Date(task.deadline).toDateString().slice(0, 10)}
                  ${new Date(task.deadline).toLocaleTimeString([], {
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
    );
  }
}
