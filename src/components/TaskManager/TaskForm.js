import React, { useState, useEffect } from "react";
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import { Button, Input } from "@material-ui/core";
import TaskList from "./TaskList";

function TaskForm(props) {
  const { tasks, setTasks } = props;
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  function handleAddTask(event) {
    // Prevent browser refresh everytime the "Add Task" button is pressed.
    event.preventDefault();
    addTask(newTaskName, newTaskDeadline, newTaskDescription);
    console.log( new Date(newTaskDeadline) - Date.now());

    setNewTaskName("");
    setNewTaskDeadline("");
    setNewTaskDescription("");
  } 

  // Adds tasks based on the name as input by the user.
  function addTask(name, deadline, description) {
    const newTasks = [
      ...tasks,
      {
        name: name,
        isComplete: false,
        dateCreated: firebase.firestore.Timestamp.now(),
        deadline: deadline,
        description: description,
      },
    ];

    if (!name || /^\s*$/.test(name)) {
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
    const docRef = db.collection("/users").doc(uid);

    docRef.get().then((doc) => {
      if (doc.exists) {
        db.collection("/users").doc(uid).update({ tasks: tasks });
      } else {
        db.collection("/users").doc(uid).set({ tasks: tasks });
      }})    
  }, [tasks]);
  
  return (
    <>
      <div>
        <h2>Add Tasks</h2>
        <form onSubmit={handleAddTask}>
          <Input
            // Input for the task name.
            required={true}
            autoFocus={true}
            className="task-name-field"
            style={{ marginRight: "1rem", paddingLeft: "3px" }}
            placeholder="Enter Task Name"
            value={newTaskName}
            inputProps={{ "aria-label": "name" }}
            // Ensures that the cursor is on the textfield when component loads
            onChange={(event) => setNewTaskName(event.target.value)}
          />

          Deadline: 
          <Input
            // Input for the deadline.
            required={true}
            className="task-deadline-field"
            type = "datetime-local"
            style={{ marginRight: "1rem", paddingLeft: "3px" }}
            value={newTaskDeadline}
            onChange={(event) => setNewTaskDeadline(event.target.value)}
            />

          <Input
            // Input a short description for the task.
            className="task-description"
            type = "text"
            style={{ marginRight: "1rem", paddingLeft: "3px" }}
            placeholder = "Describe your task."
            value={newTaskDescription}
            inputProps={{ "aria-label": "description" }}
            onChange={(event) => setNewTaskDescription(event.target.value)}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="submit-button"
          >
            create task
          </Button>
        </form>
      </div>

      <div>
        <h2>Task List</h2>
        <TaskList tasks={tasks} setTasks={setTasks} />
      </div>
    </>
  );
}
export default TaskForm;
