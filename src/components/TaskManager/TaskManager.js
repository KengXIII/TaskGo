import React, { useState, useEffect } from "react";
import { firebase } from "@firebase/app";
import "@firebase/firestore";

function TaskManager(props) {
  const { tasks, setTasks } = props;
  const [newTaskText, setNewTaskText] = useState("");

  function handleAddTask(event) {
    // Prevent browser refresh everytime the "Add Task" button is pressed.
    event.preventDefault();
    addTask(newTaskText);
    setNewTaskText("");
  }

  // Adds tasks based on the description as input by the user.
  function addTask(description) {
    const newTasks = [
      ...tasks,
      {
        description: description,
        isComplete: false,
      },
    ];

    if (!description || /^\s*$/.test(description)) {
      return;
    }

    setTasks(newTasks);
  }

  // Hook to watch for any changes in tasks. If there are changes,
  // an update to our Firestore database will be dispatched.
  useEffect(() => {
    //Optional chaining: "?." accounts for the case when currentUser is null.
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();

    console.log("2");
    db.collection("/tasks").doc(uid).set({ tasks: tasks });
  }, [tasks]);

  return (
    <>
      <div>
        <h2>Add Tasks</h2>
        <form onSubmit={handleAddTask}>
          <label>
            Task:
            <input
              style={{ margin: "0 1rem" }}
              type="text"
              value={newTaskText}
              onChange={(event) => setNewTaskText(event.target.value)}
            />
          </label>
          <input type="submit" value="Add" />
        </form>
      </div>

      <div>
        <h2>Task List</h2>
        {tasks.length > 0 ? (
          <TaskList tasks={tasks} setTasks={setTasks} />
        ) : (
          <p>Go and have fun for today!</p>
        )}
      </div>
    </>
  );
}

function TaskList(props) {
  const { tasks, setTasks } = props;

  // Toggles between completed and incomplete.
  function handleTaskToggle(toggledTask, toggledTaskIndex) {
    const newTasks = [
      ...tasks.slice(0, toggledTaskIndex),
      {
        description: toggledTask.description,
        isComplete: !toggledTask.isComplete,
      },
      ...tasks.slice(toggledTaskIndex + 1),
    ];
    setTasks(newTasks);
  }

  return (
    <table
      style={{
        margin: "0 auto",
        width: "80%",
        borderStyle: "solid",
        textAlign: "left",
        float: "left",
      }}
    >
      <thead>
        <tr>
          <th style={{ width: "8%", textAlign: "center" }}>No.</th>
          <th style={{ width: "50%" }}>Task</th>
          <th style={{ width: "5%" }}>Completed</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={index}>
            <td style={{ textAlign: "center" }}>{index + 1}</td>
            <td>{task.description}</td>
            <td style={{ textAlign: "center" }}>
              <input
                type="checkbox"
                checked={task.isComplete}
                onChange={() => handleTaskToggle(task, index)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default TaskManager;
