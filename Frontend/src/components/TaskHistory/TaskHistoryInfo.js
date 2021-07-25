import React, { useState } from "react";
import { Button, Dialog, DialogTitle } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { BiMessageSquareDetail } from "react-icons/bi";
import { TiTickOutline } from "react-icons/ti";
import { AiOutlineDelete, AiOutlineHistory } from "react-icons/ai";

function TaskHistoryInfo() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <HelpOutlineIcon
        style={{ marginLeft: "30px", cursor: "pointer", float: "right" }}
        size={30}
        onClick={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="info-dialog-title"
        style={{ alignContent: "center", padding: "px" }}
      >
        <DialogTitle id="info-dialog-title">
          <label style={{ fontSize: "30px" }}>Task History</label>
        </DialogTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0px 30px 30px 30px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p>
              <h2>Task History Dashboard</h2>
              The Task History page displays tasks that are already marked
              completed by clicking on <TiTickOutline /> in Task Dashboard.
              <br></br>
              <br></br>
              <strong>Functionalities</strong>
              All tasks are being sorted by their completion date in the Task
              History.
              <br></br>
              <br></br>
              All tasks will be automatically removed 7 days after their date of
              completion by default.
              <br></br>
              Users can choose to change this by going under 'Settings' and
              making the relevant changes.
            </p>
            <p>
              <h2>Task Dashboard</h2>
              Tasks will be displayed orderly in the Task Dashboard under 'Task
              List'.
              <br></br>
              <br></br>
              <strong>Priority Column</strong>
              <br></br>
              The left-most column shows the level of the priority of the task.
              The colour represents the respective priority levels as indicated
              in the form for task addition.
              <br></br>
              <br></br>
              <strong>Task Name Column</strong>
              <br></br>
              The task name column falls under the bolded 'Task' label. In this
              column, the name of the tasks are being shown.
              <br></br>
              <br></br>
              <strong>Description Column</strong>
              <br></br>
              The description column falls under the bolded 'Description' label.
              In this column, hovering over <BiMessageSquareDetail /> will
              reveal the task description, in the form of a pop-up bubble.
              <br></br>
              <br></br>
              <strong>Category Column</strong>
              <br></br>
              The task category column falls under the bolded 'Category' label.
              In this column, the category of the task is being displayed in
              blue.
              <br></br>
              <br></br>
              <strong>Deadline Column</strong>
              <br></br>
              The deadline column falls under the bolded 'Deadline' label. In
              this column, the deadline of the task is being displayed.
              <br></br>
              <br></br>
              <strong>Date Completed Column</strong>
              <br></br>
              The dead of completion of the task falls under the bolded 'Date
              Completed' label. In this column, the date of completion of the
              task is being displayed.
              <h3>Icons</h3>
              There are two icons under the Task History List. Clicking on the
              icons would result in changes made to the Task History List.
              <br></br>
              <br></br>
              <strong>Deleting Tasks</strong>
              <br></br>
              Clicking on <AiOutlineDelete /> would result in the task being
              permanently deleted. Do note that this action is irreversible, and
              once deleted, the task cannot be salvaged.
              <br></br>
              <br></br>
              <strong>Reverting Tasks</strong>
              <br></br>
              Clicking on <AiOutlineHistory /> would result in the completed
              task being transported back to the Task Dashboard. This function
              is provided for users in the case where they had mistakenly marked
              a task as complete by clicking on the <TiTickOutline /> icon in
              Task Dashboard.
            </p>
          </div>
          <br></br>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            <Button onClick={handleClose} variant="contained" color="primary">
              Got it!
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
export default TaskHistoryInfo;
