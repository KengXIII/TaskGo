import React, { useState, useEffect } from "react";
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import { Button, Input, Dialog, DialogTitle } from "@material-ui/core";
import { VscDiffAdded } from "react-icons/vsc";

function TaskForm(props) {
  const { tasks, setTasks } = props;
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  function handleAddTask(event) {
    // Prevent browser refresh everytime the "Add Task" button is pressed.
    event.preventDefault();
    addTask(newTaskName, newTaskDeadline, newTaskDescription);
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
      }
    });
  }, [tasks]);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setNewTaskName("");
    setNewTaskDeadline("");
    setNewTaskDescription("");
    setOpen(false);
  };

  return (
    <>
      <VscDiffAdded size={30} onClick={handleClickOpen} />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        style={{ alignContent: "center", padding: "px" }}
      >
        <DialogTitle id="form-dialog-title">
          <label style={{ fontSize: "30px" }}>Add Task</label>
        </DialogTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "0px 30px 30px 30px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "10px",
            }}
          >
            <p>Name</p>
            <p>Deadline</p>
            <p>Note</p>
          </div>

          <form
            onSubmit={handleAddTask}
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
            }}
          >
            <Input
              // Input for the task name.
              required={true}
              autoFocus={true}
              className="task-name-field"
              style={{ paddingLeft: "3px" }}
              placeholder="Enter Task Name"
              value={newTaskName}
              inputProps={{ "aria-label": "name" }}
              // Ensures that the cursor is on the textfield when component loads
              onChange={(event) => setNewTaskName(event.target.value)}
            />
            <br></br>
            <Input
              // Input for the deadline.
              required={true}
              className="task-deadline-field"
              type="datetime-local"
              style={{ paddingLeft: "3px", width: "300px" }}
              value={newTaskDeadline}
              onChange={(event) => setNewTaskDeadline(event.target.value)}
            />
            <br></br>
            <Input
              // Input a short description for the task.
              className="task-description"
              type="text"
              style={{ marginRight: "1rem", paddingLeft: "3px" }}
              placeholder="Optional"
              value={newTaskDescription}
              inputProps={{ "aria-label": "description" }}
              onChange={(event) => setNewTaskDescription(event.target.value)}
            />
            <br></br>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="submit-button"
              >
                create task
              </Button>

              <Button
                onClick={handleClose}
                variant="contained"
                color="secondary"
              >
                Close
              </Button>
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}
export default TaskForm;
