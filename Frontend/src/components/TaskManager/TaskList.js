import firebase from "@firebase/app";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  Tooltip,
  Input,
  TextField,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import { green, orange, red } from "@material-ui/core/colors";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { TiTickOutline } from "react-icons/ti";
import { MdModeEdit } from "react-icons/md";
import cancelMail from "./CancelMail";
import TaskForm from "./TaskForm";
// import TaskInfo from "./TaskInfo";
import updateTasks from "./updateTasks";
import SortTask from "./SortTask";
import AddHistory from "../TaskHistory/AddHistory";
import addTask from "./AddTask";
import sendMailReminder from "./SendMail";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sort, setSort] = useState("deadline");

  // Global variables from Firebase
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();

  // Realtime data from firestore
  useEffect(() => {
    const docRef = db.collection("/users").doc(uid);
    docRef.onSnapshot((doc) => {
      setTasks(doc.data().tasks);
      setSort(doc.data().sortView);
    });
    setLoaded(true);
  }, [db, uid]);

  // Styling for the Selector of the Sorting system.
  const BootstrapInput = withStyles((theme) => ({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "10px 26px 10px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
    },
  }))(InputBase);

  const handleChange = (event) => {
    setSort(event.target.value);
    SortTask(event.target.value);
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
      AddHistory(
        tasks[toggledTaskIndex].name,
        tasks[toggledTaskIndex].priority,
        tasks[toggledTaskIndex].dateCreated,
        tasks[toggledTaskIndex].deadline,
        tasks[toggledTaskIndex].category,
        tasks[toggledTaskIndex].description,
        tasks[toggledTaskIndex].taskId
      );

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

  function handleDeleteTask(deleteIndex) {
    if (busy) {
      console.log("lagged");
      window.setTimeout(handleDeleteTask, 50);
    } else {
      setBusy(true);
      console.log("task started");
      // Cancel Mail
      cancelMail(tasks[deleteIndex].taskId);

      //Remove the task from local array
      const newTask = [
        ...tasks.slice(0, deleteIndex),
        ...tasks.slice(deleteIndex + 1),
      ];
      //Update array with new elements
      setTasks(newTask);
      updateTasks(newTask);
      setBusy(false);
      console.log("task ended");
    }
  }

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

  const [open, setOpen] = useState(false);

  const handleClickOpen = (task, index) => {
    setNewTaskName(task.name);
    const date = new Date(
      task.deadline.toDate().getTime() + 28800000
    ).toISOString();
    console.log(date);
    setNewTaskDeadline(date.substring(0, date.length - 1));
    setNewTaskDescription(task.description);
    setNewTaskPriority(task.priority);
    setNewTaskCategory(task.category);
    setEditIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setNewTaskName("");
    setNewTaskDeadline("");
    setNewTaskDescription("");
    setNewTaskPriority("3");
    setNewTaskCategory("");
    setEditIndex("");
    setOpen(false);
  };

  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("3");
  const [newTaskCategory, setNewTaskCategory] = useState("");
  const [editIndex, setEditIndex] = useState("");

  const handleEdit = (event) => {
    event.preventDefault();
    //Remove the task from local array
    cancelMail(tasks[editIndex].taskId);
    const newTasks = [
      ...tasks.slice(0, editIndex),
      ...tasks.slice(editIndex + 1),
    ];
    //Update array with new elements
    setTasks(newTasks);
    updateTasks(newTasks);

    const createTime = new Date().toISOString();
    const taskId = firebase.auth().currentUser.uid + createTime;
    const insertionDeadline = new Date(newTaskDeadline);

    sendMailReminder(taskId, insertionDeadline, newTaskName);

    addTask(
      newTaskName,
      newTaskPriority,
      insertionDeadline,
      newTaskCategory,
      newTaskDescription,
      taskId
    );

    handleClose();
  };

  if (!loaded) {
    return null;
  } else {
    return (
      <main>
        <h2>
          Task List
          <TaskForm />
          <div style={{ display: "block", float: "right" }}>
            <FormControl style={{ float: "right" }}>
              <NativeSelect
                value={sort}
                onChange={handleChange}
                input={<BootstrapInput />}
              >
                <option value={"deadline"}>Deadline</option>
                <option value={"priority"}>Priority</option>
                <option value={"category"}>Category</option>
              </NativeSelect>
            </FormControl>
          </div>
          {/* <TaskInfo style={{ display :"flex", flexDirection: "row", flush:"Right"}} /> */}
        </h2>

        {tasks.length <= 0 ? (
          <p>Go and have fun for today!</p>
        ) : (
          <div
            style={{
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
            }}
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
                    <td>
                      <MdModeEdit
                        onClick={() => handleClickOpen(task, index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  <p>
                    Deadline<label style={{ color: "red" }}>*</label>
                  </p>
                  <p>
                    Priority<label style={{ color: "red" }}>*</label>
                  </p>
                  <p>Category</p>
                  <p>Description</p>
                </div>

                <form
                  onSubmit={handleEdit}
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

                  <TextField
                    // Input for the deadline.
                    required={true}
                    inputProps={{
                      min: new Date(Date.now() + 28800000)
                        .toJSON()
                        .slice(0, 16),
                    }}
                    className="task-deadline-field"
                    type="datetime-local"
                    style={{ paddingLeft: "3px", width: "300px" }}
                    value={newTaskDeadline}
                    onChange={(event) => setNewTaskDeadline(event.target.value)}
                  />
                  <br></br>
                  <div
                  // Priority is selected via 3 Radio buttons. Default selected radio is Priority 3 Radio.
                  >
                    <P1Radio
                      checked={newTaskPriority === "1"}
                      onClick={(event) =>
                        setNewTaskPriority(event.target.value)
                      }
                      value="1"
                      name="radio-button"
                      inputProps={{ "aria-label": "Radio A" }}
                      size="small"
                    />
                    <P2Radio
                      checked={newTaskPriority === "2"}
                      onClick={(event) =>
                        setNewTaskPriority(event.target.value)
                      }
                      value="2"
                      name="radio-button"
                      inputProps={{ "aria-label": "Radio B" }}
                      size="small"
                    />
                    <P3Radio
                      checked={newTaskPriority === "3"}
                      onClick={(event) =>
                        setNewTaskPriority(event.target.value)
                      }
                      value="3"
                      name="radio-button"
                      inputProps={{ "aria-label": "Radio C" }}
                      size="small"
                    />
                  </div>
                  <br></br>
                  <Input
                    // Input a task category.
                    className="task-category"
                    type="text"
                    style={{ marginRight: "1rem", paddingLeft: "3px" }}
                    placeholder="Optional"
                    value={newTaskCategory}
                    inputProps={{ "aria-label": "description" }}
                    onChange={(event) => setNewTaskCategory(event.target.value)}
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
                    onChange={(event) =>
                      setNewTaskDescription(event.target.value)
                    }
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
                      Save task
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
          </div>
        )}
      </main>
    );
  }
}
