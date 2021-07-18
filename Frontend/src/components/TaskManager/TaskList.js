import firebase from "@firebase/app";
import {
  Button,
  Dialog,
  DialogTitle,
  FormControl,
  Tooltip,
  Input,
  TextField,
  FormControlLabel,
  Checkbox,
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
import AddBox from "@material-ui/icons/AddBox";
import IndeterminateCheckBox from "@material-ui/icons/IndeterminateCheckBox";
import cancelMail from "./CancelMail";
import TaskForm from "./TaskForm";
import TaskInfo from "./TaskInfo";
import updateTasks from "./updateTasks";
import SortTask from "./SortTask";
import AddHistory from "../TaskHistory/AddHistory";
import addTask from "./AddTask";
import sendMailReminder from "./SendMail";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [display, setDisplay] = useState([]);
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

  // UNFINISHED!!! This hook is for monitoring all available categories.
  const [category, setCategory] = useState(["TaskA", "TaskB", "TaskC"]);
  // UNFINISHED!!! This hook is for monitoring all the checks.
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    var temp = {};
    category.forEach((item) => {
      temp[item] = true;
    });
    setChecked(temp);
  }, []);

  // This hook is for filtering by Category.
  const [filter, setFilter] = useState(category);

  // This function is for when 'Choose no category' is clicked.
  function chooseNone() {
    setFilter([]);
  }

  // This function is for when 'Choose all category' is clicked.
  function chooseAll() {
    // UNFINISHED!!! tick all the options available.
    setFilter(category);
  }

  // This function is for filtering when a certain category button is activated.
  function addFilter(addedCategory) {
    const newFilter = [...filter.slice(0), addedCategory];
    setFilter(newFilter);
  }

  // This function is for filtering when a certain category button is deactivated.
  function deleteFilter(deletedCategory) {
    const newFilter = filter.filter((cat) => cat !== deletedCategory);
    setFilter(newFilter);
  }

  // Updates the local copy of array when database array change
  useEffect(() => {
    setDisplay([]);
    var newDisp = [];
    tasks.forEach((current, index) => {
      newDisp = [...newDisp, { taskIndex: index, task: current }];
    });
    newDisp = newDisp.filter((pair) => filter.includes(pair.task.category));
    setDisplay(newDisp);
  }, [tasks, filter]);

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
      window.setTimeout(handleTaskToggle, 50);
    } else {
      setBusy(true);
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
    }
  }

  function handleDeleteTask(deleteIndex) {
    if (busy) {
      window.setTimeout(handleDeleteTask, 50);
    } else {
      setBusy(true);
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

  // This is for task addition form for Edit function.
  const [open, setOpen] = useState(false);

  const handleClickOpen = (task, index) => {
    setNewTaskName(task.name);
    const date = new Date(
      task.deadline.toDate().getTime() + 28800000
    ).toISOString();
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
          Category Filter
          <Button style={{ cursor: "pointer" }} onClick={chooseAll}>
            <AddBox />
          </Button>
          <Button style={{ cursor: "pointer" }} onClick={chooseNone}>
            <IndeterminateCheckBox />
          </Button>
          <TaskInfo
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: "1rem",
              fontSize: "medium",
            }}
          />
        </h2>

        {/* <Button style={{ cursor: "pointer" }} onClick={() => addFilter("??")}>
          All other categories belong here.
        </Button> */}
        <div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {category.map((cat) => (
              <div style={{ justifyContent: "space-evenly" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={cat}
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite />}
                      // check =
                      onClick={(event) =>
                        event.target.checked
                          ? addFilter(event.target.value)
                          : deleteFilter(event.target.value)
                      }
                      value={cat}
                      defaultChecked={true}
                    />
                  }
                  label={cat}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Button
            onClick={() => {
              console.log(
                "Tasks: " + tasks.length,
                "Display: " + display.length,
                "Filter: " + filter.length
              );
            }}
          >
            Debug
          </Button>
        </div>

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
        </h2>

        {display.length <= 0 ? (
          <p>No relevant tasks!</p>
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
                {display.map((pair, index) => (
                  <tr
                    style={
                      pair.task.deadline.toDate() < new Date()
                        ? { backgroundColor: "#ff7a7a50" }
                        : {}
                    }
                    key={index}
                    className="scroll-list"
                  >
                    <td
                      style={
                        pair.task.priority === "1"
                          ? { backgroundColor: "darkorange" }
                          : pair.task.priority === "2"
                          ? { backgroundColor: "#ecd540" }
                          : { backgroundColor: "limegreen" }
                      }
                    ></td>
                    <td style={{ wordWrap: "break-word", paddingLeft: "5px" }}>
                      {pair.task.name}
                    </td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}>
                      <Tooltip
                        title={pair.task.description}
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
                      {pair.task.category}
                    </td>
                    <td>
                      {`${pair.task.deadline
                        .toDate()
                        .toDateString()
                        .slice(0, 10)}
                  ${pair.task.deadline.toDate().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                    </td>

                    <td style={{ textAlign: "center", cursor: "pointer" }}>
                      <TiTickOutline
                        onClick={() => handleTaskToggle(pair.index)}
                      />
                    </td>
                    <td style={{ textAlign: "center", cursor: "pointer" }}>
                      <AiOutlineDelete
                        onClick={() => handleDeleteTask(pair.index)}
                        className="delete-icon"
                      />
                    </td>
                    <td>
                      <MdModeEdit
                        onClick={() => handleClickOpen(pair.task, pair.index)}
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
