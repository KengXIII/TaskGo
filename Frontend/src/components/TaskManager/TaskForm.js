import React, { useState, useEffect } from "react";
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import {
  Button,
  Input,
  Dialog,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { VscDiffAdded } from "react-icons/vsc";
import axios from "axios";

function TaskForm(props) {
  const { tasks, setTasks } = props;
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  var send = false;

  function handleAddTask(event) {
    // Prevent browser refresh everytime the "Add Task" button is pressed.
    event.preventDefault();
    const createTime = new Date(Date.now()).toISOString();
    const taskId = firebase.auth().currentUser.uid + createTime;
    addTask(newTaskName, newTaskDeadline, newTaskDescription, tasks, taskId);
    setNewTaskName("");
    setNewTaskDeadline("");
    setNewTaskDescription("");
    if (send) {
      sendMailReminder(taskId);
      send = false;
    }
  }

  function sendMailReminder(taskId) {
    const dueDate = new Date(newTaskDeadline);
    const emailPrior = 60 * 1000;
    const emailDate = new Date(dueDate.getTime() - emailPrior);
    axios
      //.post("https://stark-plains-53456.herokuapp.com/send_mail", {
      .post("http://localhost:4000/send_mail", {
        taskName: newTaskName,
        date: dueDate.toDateString(),
        time: `${dueDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        name: firebase.auth().currentUser.displayName,
        email: firebase.auth().currentUser.email,
        emailTime: emailDate,
        jobName: taskId,
      })
      .then((res) => {
        res.status === 200 ? alert("Message sent!") : alert("Try again!");
      })
      .catch((err) => console.error(err));
  }
  // use "http://localhost:4000/send_mail" for local development

  // Adds tasks into input array.
  function addTask(name, deadline, description, array, taskId) {
    const insertionDeadline = new Date(deadline);

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

    var index;

    if (array.length === 0) {
      index = 0;
    } else {
      index = addTaskIndex(0, array.length - 1);
    }

    const newTasks = [
      ...array.slice(0, index),
      {
        name: name,
        priority: 1,
        isComplete: false,
        dateCreated: firebase.firestore.Timestamp.now(),
        dateCompleted: "",
        deadline: deadline,
        description: description,
        jobName: taskId,
      },
      ...array.slice(index),
    ];

    if (!name || /^\s*$/.test(name)) {
      return;
    } else {
      send = true;
    }
    setTasks(newTasks);
    console.log(taskId);
  }

  // An update to our Firestore database will be dispatched.
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
            <p>
              Name<label style={{ color: "red" }}>*</label>
            </p>
            <p>Description</p>
            <p>
              Deadline<label style={{ color: "red" }}>*</label>
            </p>
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

            <TextField
              // Input for the deadline.
              required={true}
              inputProps={{ min: new Date(Date.now()).toJSON().slice(0, 16) }}
              className="task-deadline-field"
              type="datetime-local"
              style={{ paddingLeft: "3px", width: "300px" }}
              value={newTaskDeadline}
              onChange={(event) => setNewTaskDeadline(event.target.value)}
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
