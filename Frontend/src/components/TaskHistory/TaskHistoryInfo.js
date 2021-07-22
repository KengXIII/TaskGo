import React, { useState } from "react";
import { Button, Dialog, DialogTitle } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { BiCalendarPlus, BiMessageSquareDetail } from "react-icons/bi";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { TiTickOutline } from "react-icons/ti";
import { AiOutlineDelete } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import AddBox from "@material-ui/icons/AddBox";
import IndeterminateCheckBox from "@material-ui/icons/IndeterminateCheckBox";

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
              The Task History page displays  
              <br></br>
              <br></br>
              <strong>Name</strong>
              <br></br>
              Fill in the name of the task.
              <br></br>
              <br></br>
              <strong>Deadline</strong>
              <br></br>
              Specify the deadline of the task by clicking on{" "}
              <CalendarTodayIcon fontSize="small" /> and entering the relevant
              details.
              <br></br>
              <br></br>
              TaskGo finds no purpose in allowing the creation of tasks that are
              overdue. Hence, with the exception of editing tasks, the user
              cannot enter dates that are earlier than the current time.
              <br></br>
              <br></br>
              <strong>Priority</strong>
              <br></br>
              Select the level of priority of the task.
              <br></br>
              <br></br>
              The left-most selection (Red) indicates tasks of the highest
              priority.
              <br></br>
              The middle selection (Orange) indicates tasks of mediocre
              priority.
              <br></br>
              The right-most (Green) selection indicates tasks of the lowest
              priority.
              <br></br>
              <br></br>
              <strong>Category (Optional)</strong>
              <br></br>
              Enter the category in which the task belongs in. This field is
              implemented to facilitate the users' organisation of tasks. If the
              user does not want to assign any category to a task, this field
              can simply be left blank.
              <br></br>
              <br></br>
              <strong>Description (Optional)</strong>
              <br></br>
              Give a small description of the task. All miscellaneous remarks
              about the task goes here.
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
              At the far right side of the task name column, each task will have
              a <BiMessageSquareDetail /> icon. Hovering over this icon would
              result in the task description appearing in the form of a pop-up
              bubble.
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
              <strong>Icons Column</strong>
              <br></br>
              There are three icons under the icons column. Clicking on the
              icons would result in changes made to the Task Dashboard.
              <br></br>
              <br></br>
              Clicking on <TiTickOutline /> would result in the task being
              marked as 'complete'. All tasks that are marked as 'complete' will
              be transferred to the 'Task History' page.
              <br></br>
              <br></br>
              Clicking on <AiOutlineDelete /> would result in the task being
              permanently deleted. Do note that this action is irreversible, and
              once deleted, the task cannot be salvaged.
              <br></br>
              <br></br>
              Users can edit their tasks by clicking on the <MdModeEdit /> icon.
              The task insertion form will appear, and the task will be updated
              after the user makes the necessary update.
            </p>
            <p>
              <h2>Task Filtering</h2>
              Users can choose to filter out the tasks by selecting the relevant categories under 'Category Filter'.
              <br></br>
              <br></br>
              Clicking on <AddBox /> would cause tasks from all categories will be displayed on the TaskList.
              <br></br>
              Clicking on <IndeterminateCheckBox /> would cause the Task Dashboard to display no tasks, and reset the buttons to unselected.
            </p>
            <p>
              <h2>Task Sorting</h2>
              All tasks are sorted according to deadline by default. By toggling
              the dropdown at the top right of the screen, the user can choose
              the way in which the tasks is sorted by.
              <br></br>
              <br></br>
              <strong>Sorting Dropdown</strong>
              <br></br>
              <br></br>
              Selecting <em>Deadline</em> will result in the tasks being sorted
              by deadline. Tasks with the earliest deadline will be placed at
              the top of the dashboard.
              <br></br>
              <br></br>
              Selecting <em>Priority</em> will result in the tasks being sorted
              by priority. Tasks with the highest priority level will be placed
              at the top of the dashboard.
              <br></br>
              <br></br>
              Selecting <em>Category</em> will result in the tasks being sorted
              by category. The sorting is done in a alphanumeric way.
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