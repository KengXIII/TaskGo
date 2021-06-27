import firebase from "@firebase/app";
import { useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TiTickOutline } from "react-icons/ti";

export default function TaskList(props) {
  const { history, setHistory, tasks, setTasks } = props;

  useEffect(() => {
    const uid = firebase.auth().currentUser?.uid;
    const db = firebase.firestore();
    db.collection("/users").doc(uid).update({ tasks: tasks, history: history });
  }, [tasks, history]);

  // Toggles between completed and incomplete.
  function handleTaskToggle(toggledTaskIndex) {
    //Declare the task to be toggled
    const newHistory = [
      {
        name: tasks[toggledTaskIndex].name,
        priority: 1,
        isComplete: true,
        dateCreated: tasks[toggledTaskIndex].dateCreated,
        dateCompleted: firebase.firestore.Timestamp.now(),
        deadline: tasks[toggledTaskIndex].deadline,
        description: tasks[toggledTaskIndex].description,
      },
      ...history.slice(0),
    ];

    setHistory(newHistory);

    //Remove the task from local array
    const newTasks = [
      ...tasks.slice(0, toggledTaskIndex),
      ...tasks.slice(toggledTaskIndex + 1),
    ];
    //Update array with new elements
    setTasks(newTasks);
  }

  function handleDeleteTask(index) {
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
          width: "95%",
          textAlign: "left",
          float: "left",
        }}
      >
        <thead>
          <tr>
            <th style={{ width: "5%", textAlign: "left" }}>No.</th>
            <th style={{ width: "25%" }}>Task</th>
            <th style={{ width: "40%" }}>Description</th>
            <th style={{ width: "15%" }}>Deadline</th>
            <th style={{ width: "5%" }}></th>
            <th style={{ width: "5%" }}></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td style={{ textAlign: "left" }}>{index + 1}</td>
              <td>{task.name}</td>
              <td style={{ color: "darkblue" }}>{task.description}</td>
              <td>{`${new Date(task.deadline).toDateString()},
                    ${new Date(task.deadline).toLocaleTimeString().slice(0, 5)}
                    ${new Date(task.deadline)
                      .toLocaleTimeString()
                      .slice(9)}`}</td>
              <td style={{ textAlign: "center" }}>
                <TiTickOutline onClick={() => handleTaskToggle(index)} />
              </td>
              <td style={{ textAlign: "center" }}>
                <AiOutlineDelete
                  onClick={() => handleDeleteTask(index)}
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
