import firebase from "@firebase/app";
import { AiOutlineDelete } from "react-icons/ai";
import { TiTickOutline } from "react-icons/ti"

export default function TaskList(props) {
    const { tasks, setTasks } = props;
  
    // Toggles between completed and incomplete.
    function handleTaskToggle(toggledTask, toggledTaskIndex) {
      const uid = firebase.auth().currentUser?.uid; 
      const db = firebase.firestore();
      tasks[toggledTaskIndex].isComplete = !tasks[toggledTaskIndex].isComplete;
      //Add the toggled task into firestore
      db.collection("/users").doc(uid).update({ history: firebase.firestore.FieldValue.arrayUnion(tasks[toggledTaskIndex])});
      //Remove the task from local array
      const newTasks = [...tasks.slice(0, toggledTaskIndex), ...tasks.slice(toggledTaskIndex + 1)];
      //Update array with new elements
      setTasks(newTasks);
    }
  
    function handleDeleteTask(task, index) {
      //Remove the task from local array
      const newTask = [...tasks.slice(0, index), ...tasks.slice(index + 1)];
      //Update array with new elements
      setTasks(newTask);
    }
  
    if (tasks.length <= 0) {
      return <p>Go and have fun for today!</p>;
    } else {
      return (
        <table
          style={{
            margin: "0 auto",
            width: "90%",
            textAlign: "left",
            float: "left",
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "5%", textAlign: "left" }}>No.</th>
              <th style={{ width: "25%" }}>Task</th>
              <th style={{ width: "20%"}}>Deadline</th>
              <th style={{ width: "40%"}}>Description</th>
              <th style={{ width: "5%" }}></th>
              <th style={{ width: "5%" }}></th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td style={{ textAlign: "left" }}>{index + 1}</td>
                <td>{task.name}</td>
                <td>{task.deadline}</td>
                <td>{task.description}</td>
                <td style={{ textAlign: "center" }}>
                  <TiTickOutline 
                    onClick={()=> handleTaskToggle(task, index)}
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
  }