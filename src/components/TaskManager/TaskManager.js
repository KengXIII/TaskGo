import React, { useState, useEffect, useRef } from "react";
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import { Button, Input } from "@material-ui/core";
import { AiOutlineDelete } from "react-icons/ai";

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
        dateCreated: firebase.firestore.Timestamp.now(),
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

    db.collection("/tasks").doc(uid).set({ tasks: tasks });
  }, [tasks]);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  });

  return (
    <>
      <div>
        <h2>Add Tasks</h2>
        <form onSubmit={handleAddTask}>
          <Input
            className="task-name-field"
            style={{ marginRight: "1rem", paddingLeft: "3px" }}
            placeholder="Enter Task Name"
            value={newTaskText}
            inputProps={{ "aria-label": "description" }}
            // Ensures that the cursor is on the textfield when component loads
            ref={inputRef}
            onChange={(event) => setNewTaskText(event.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            className="submit-button"
            onClick={handleAddTask}
          >
            create task
          </Button>
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

  function handleDeleteTask(task, index) {
    const newTask = [
      ...tasks.slice(0, index), 
      ...tasks.slice(index + 1),
    ];
    setTasks(newTask);
  }

  return (
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
          <th style={{ width: "5%" }}>Completed</th>
          <th style={{ width: "5%" }}>Delete</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, index) => (
          <tr key={index}>
            <td style={{ textAlign: "left" }}>{index + 1}</td>
            <td>{task.description}</td>
            <td style={{ textAlign: "center" }}>
              <input
                type="checkbox"
                checked={task.isComplete}
                onChange={() => handleTaskToggle(task, index)}
              />
            </td>
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
  );
}
export default TaskManager;
