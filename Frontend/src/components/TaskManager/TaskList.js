import firebase from "@firebase/app";
import { Button, FormControl, Tooltip } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { TiTickOutline } from "react-icons/ti";
import updateHistory from "../TaskHistory/updateHistory";
import cancelMail from "./CancelMail";
import TaskForm from "./TaskForm";
import TaskInfo from "./TaskInfo";
import updateTasks from "./updateTasks";

export default function TaskList() {
  const [history, setHistory] = useState([]);
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
      setHistory(doc.data().history);
    });
    setLoaded(true);
  }, []);

  // Styling for the Selector of the Sorting system.
  const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #ced4da',
      fontSize: 16,
      padding: '10px 26px 10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
  }))(InputBase);
  
  // Toggles the sorting method to apply. Order of sort: 
  // deadline(default), priority, category 
  const handleSort = (event) => {
    // console.log("current", sort)
    // console.log("target", event.target.value)
    setSort(event.target.value);
    // console.log("new", sort);
    var sortingMethod;
      switch (event.target.value) {
        case "deadline":
          sortingMethod = (task1, task2) => {
            if (task1.deadline === task2.deadline) {
              if ( task1.priority === task2.priority ) {
                if ( task1.name < task2.name ) {
                  return 1;
                } else {
                  return -1;
                }
              } else {
                return task1.priority - task2.priority;
              }
            } else {
            return task1.deadline - task2.deadline;
            }
          };
        //  sortMode("deadline");
          break;
        case "priority":
          sortingMethod = (task1, task2) => {
            if ( task1.priority === task2.priority ) {
              if ( task1.deadline === task2.deadline ) {
                if ( task1.name < task2.name ) {
                  return -1;
                } else {
                  return 1;
                }
              } else {
                return task1.deadline - task2.deadline;
              };
            } else {
              return task1.priority - task2.priority;
            }
          };
        //  sortMode("priority")
          break;
        case "category":
          console.log("I CAME TO CATEGORY");
          sortingMethod = (task1, task2) => {
            if (task1.category < task2.category) {
              return -1;
            } else if (task1.category === task2.category){
              if (task1.deadline === task2.deadline) {
                if ( task1.priority === task2.priority ) {
                  if ( task1.name < task2.name ) {
                    return -1;
                  } else {
                    return 1;
                  }         
                } else {
                  return task1.priority - task2.priority;
                }
              } else {
              return task1.deadline - task2.deadline;
              }
            }  else {
              return 1;
            }
          };
        //  sortMode("category")
          break;
        default:
          console.log("Should not come here...");
          break;
      }
      
    const processed = tasks.sort(sortingMethod);
    setTasks(processed);
    console.log("lastly", sort);
  }

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
          category: tasks[toggledTaskIndex].category,
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
          <TaskInfo style={{ display :"flex", flexDirection: "row", flush:"Right"}} />
        </h2>

        <div style={{display: "flex", flexDirection: "column"}}>
        <div style={{display: "block", float: "right"}}>
        <FormControl style={{ float:"right" }}>
          <NativeSelect
            value={sort}
            onChange={handleSort}
            input={<BootstrapInput />}
          >
            <option value={"deadline"}>Deadline</option>
            <option value={"priority"}>Priority</option>
            <option value={"category"}>Category</option>
          </NativeSelect>
        </FormControl>
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
        </div>
      </main>
    );
  }
}
