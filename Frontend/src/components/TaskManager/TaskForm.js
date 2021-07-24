import React, { useState } from "react";
import { firebase } from "@firebase/app";
import "@firebase/firestore";
import {
  Button,
  Input,
  Dialog,
  DialogTitle,
  TextField,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import { withStyles } from "@material-ui/core/styles";
import { green, orange, red } from "@material-ui/core/colors";
import { BiCalendarPlus } from "react-icons/bi";
import addTask from "./AddTask";
import addIntervaltask from "./AddIntervalTask";

function TaskForm() {
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("3");
  const [newTaskCategory, setNewTaskCategory] = useState("");

  // State of dialog opening/closing
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setNewTaskName("");
    setNewTaskDeadline("");
    setNewTaskDescription("");
    setNewTaskPriority("3");
    setNewTaskCategory("");
    setOpen(false);
    setIntervalData({ interval: false, mode: "Single" });
    setIntervalDay("");
    setIntervalEnd("");
  };

  // Values for interval task
  const [intervalEnd, setIntervalEnd] = useState("");
  const [interval, setIntervalDay] = useState("");

  const [intervalData, setIntervalData] = useState({
    interval: false,
    mode: "Single",
  });

  const handleIntervalToggle = () => {
    if (intervalData.interval) {
      setIntervalData({
        interval: false,
        mode: "Single",
      });
    } else {
      setIntervalData({
        interval: true,
        mode: "Interval",
      });
    }
  };

  // Creating our Coloured Radio buttons...
  const P3Radio = withStyles({
    root: {
      color: green[400],
      "&$checked": {
        color: green[600],
      },
    },
    checked: {},
  })((P3props) => <Radio color="default" {...P3props} />);

  const P2Radio = withStyles({
    root: {
      color: orange[400],
      "&$checked": {
        color: orange[600],
      },
    },
    checked: {},
  })((P2props) => <Radio color="default" {...P2props} />);

  const P1Radio = withStyles({
    root: {
      color: red[400],
      "&$checked": {
        color: red[600],
      },
    },
    checked: {},
  })((P1props) => <Radio color="default" {...P1props} />);

  function handleAddTask(event) {
    // Prevent browser refresh everytime the "Add Task" button is pressed.
    event.preventDefault();
    const createTime = new Date().toISOString();
    const taskId = firebase.auth().currentUser.uid + createTime;
    const insertionDeadline = new Date(newTaskDeadline);

    // Check for description, default will be "no description"
    var inputDescription;
    if (!newTaskDescription || /^\s*$/.test(newTaskDescription)) {
      inputDescription = "No description";
    } else {
      inputDescription = newTaskDescription;
    }

    // Check if task contains only spaces, no mail will be sent if true
    if (!newTaskName || /^\s*$/.test(newTaskName)) {
      return;
    }

    // Adding task into database
    if (intervalData.interval) {
      addIntervaltask(
        newTaskName,
        newTaskPriority,
        insertionDeadline,
        newTaskCategory,
        inputDescription,
        taskId,
        interval * 86400000, // should use interval
        new Date(intervalEnd) // should use new Date(intervalEnd)
      );
    } else {
      addTask(
        newTaskName,
        newTaskPriority,
        insertionDeadline,
        newTaskCategory,
        inputDescription,
        taskId
      );
    }

    setNewTaskName("");
    setNewTaskDeadline("");
    setNewTaskDescription("");
    setNewTaskPriority("3");
    setNewTaskCategory("");
    setIntervalDay("");
    setIntervalEnd("");
  }

  return (
    <>
      <BiCalendarPlus
        style={{
          marginLeft: "30px",
          cursor: "pointer",
        }}
        size={25}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        style={{ alignContent: "center" }}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">
          <label style={{ fontSize: "30px" }}>Add Task</label>
          <FormControlLabel
            control={
              <Switch
                checked={intervalData.interval}
                onChange={handleIntervalToggle}
              />
            }
            label={intervalData.mode}
            labelPlacement="start"
            style={{ float: "right" }}
          />
        </DialogTitle>
        <div style={{ padding: "0px 30px 30px 30px" }}>
          <form
            onSubmit={handleAddTask}
            style={{
              marginTop: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ flex: "28%" }}>
                Name<label style={{ color: "red" }}>*</label>
              </span>
              <div style={{ flex: "80%" }}>
                <Input
                  // Input for the task name.
                  required={true}
                  // Ensures that the cursor is on the textfield when component loads
                  autoFocus={true}
                  className="task-name-field"
                  style={{ paddingLeft: "3px" }}
                  placeholder="Enter Task Name"
                  value={newTaskName}
                  inputProps={{ "aria-label": "name" }}
                  onChange={(event) => setNewTaskName(event.target.value)}
                  fullWidth={true}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ flex: "28%" }}>
                Deadline<label style={{ color: "red" }}>*</label>
              </span>
              <div style={{ flex: "80%" }}>
                <TextField
                  // Input for the deadline.
                  required={true}
                  inputProps={{
                    min: new Date(Date.now() + 28800000).toJSON().slice(0, 16),
                  }}
                  className="task-deadline-field"
                  type="datetime-local"
                  value={newTaskDeadline}
                  onChange={(event) => setNewTaskDeadline(event.target.value)}
                  fullWidth={true}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ flex: "28%" }}>
                Priority<label style={{ color: "red" }}>*</label>
              </span>

              <div style={{ flex: "80%" }}>
                <P1Radio
                  checked={newTaskPriority === "1"}
                  onClick={(event) => setNewTaskPriority(event.target.value)}
                  value="1"
                  name="radio-button"
                  inputProps={{ "aria-label": "Radio A" }}
                  size="small"
                />
                <P2Radio
                  checked={newTaskPriority === "2"}
                  onClick={(event) => setNewTaskPriority(event.target.value)}
                  value="2"
                  name="radio-button"
                  inputProps={{ "aria-label": "Radio B" }}
                  size="small"
                />
                <P3Radio
                  checked={newTaskPriority === "3"}
                  onClick={(event) => setNewTaskPriority(event.target.value)}
                  value="3"
                  name="radio-button"
                  inputProps={{ "aria-label": "Radio C" }}
                  size="small"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ flex: "28%" }}>Category</span>
              <div style={{ flex: "80%" }}>
                <Input
                  // Input a task category.
                  className="task-category"
                  type="text"
                  style={{ marginRight: "1rem", paddingLeft: "3px" }}
                  placeholder="Optional"
                  value={newTaskCategory}
                  inputProps={{ "aria-label": "description" }}
                  onChange={(event) => setNewTaskCategory(event.target.value)}
                  fullWidth={true}
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span style={{ flex: "28%" }}>Description</span>
              <div style={{ flex: "80%" }}>
                <Input
                  // Input a short description for the task.
                  className="task-description"
                  type="text"
                  style={{ marginRight: "1rem", paddingLeft: "3px" }}
                  placeholder="Optional"
                  value={newTaskDescription}
                  inputProps={{ "aria-label": "description" }}
                  onChange={(event) =>
                    setNewTaskDescription(event.target.value)
                  }
                  fullWidth={true}
                />
              </div>
            </div>

            {intervalData.interval ? (
              <div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ flex: "28%" }}>Interval End</span>

                  <div style={{ flex: "80%" }}>
                    <TextField
                      // Input for the interval end.
                      className="interval-end"
                      type="date"
                      value={intervalEnd}
                      onChange={(event) => setIntervalEnd(event.target.value)}
                      fullWidth={true}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <span style={{ flex: "28%" }}>Repeat in</span>
                  <div style={{ flex: "80%" }}>
                    <Input
                      // Input how many days between each task
                      type="number"
                      style={{ marginRight: "1rem", paddingLeft: "3px" }}
                      placeholder="days"
                      value={interval}
                      inputProps={{ "aria-label": "description", min: "1" }}
                      onChange={(event) => setIntervalDay(event.target.value)}
                      fullWidth={true}
                    />
                  </div>
                </div>
              </div>
            ) : null}

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
