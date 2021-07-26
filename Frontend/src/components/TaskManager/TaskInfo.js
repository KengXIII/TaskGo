import React, { useState } from "react";
import { Button, Dialog, DialogTitle } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import {
  BiCalendarAlt,
  BiCalendarPlus,
  BiMessageSquareDetail,
} from "react-icons/bi";
import { TiTickOutline } from "react-icons/ti";
import { AiOutlineDelete } from "react-icons/ai";
import { MdModeEdit } from "react-icons/md";
import {
  RiAddBoxFill,
  RiChatOffLine,
  RiCheckboxIndeterminateFill,
} from "react-icons/ri";

function TaskInfo() {
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
          <label style={{ fontSize: "30px" }}>Task Dashboard</label>
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
              <h2>Inserting Tasks</h2>
              Click on the icon <BiCalendarPlus /> to start inserting tasks.
              <br></br>
              <br></br>
              <h3>Types of Tasks</h3>
              There are 2 kinds of tasks a user can create: Single and Routine
              Task.
              <br></br>
              Users can choose to switch between creating Single and Routine
              tasks through the toggle button at the top-right side of the Task
              Form.
              <br></br>
              <br></br>
              <strong>Single Tasks</strong>
              <br></br>
              Single tasks are created to target tasks that are non-routine.
              <br></br>
              These tasks are created individually by the user.
              <br></br>
              <br></br>
              <strong>Routine Tasks</strong>
              <br></br>
              Routine tasks are created to target tasks that occur routinely.
              <br></br>
              After an routine task is being created, the first initial task
              will be created.
              <br></br>
              The next task will be created one day before the deadline of the
              previous task.
              <br></br>
              Tasks will be created in such fashion until the specified date
              which marks the end of the routine task.
              <br></br>
              <br></br>
              <h3>Fields in the Form</h3>
              <strong>Name</strong>
              <br></br>
              Fill in the name of the task.
              <br></br>
              <br></br>
              <strong>Deadline</strong>
              <br></br>
              Specify the deadline of the task by clicking on <BiCalendarAlt />{" "}
              and entering the relevant details.
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
              Gives a small description of the task. All miscellaneous remarks
              about the task goes here.
              <br></br>
              <br></br>
              <strong>Routine End (Routine Only)</strong>
              <br></br>
              Specifies the date where the routine task ends. A routine task
              will stop the automatic creation of tasks after this specified
              timestamp.
              <br></br>
              <br></br>
              <strong>Interval (Routine Only)</strong>
              <br></br>
              Specifies how frequent the routine task is.
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
              In this column, the category of the task is being displayed.
              <br></br>
              Tasks that are created by leaving 'Category' blank would be
              labelled <RiChatOffLine /> under the Category Column.
              <br></br>
              <br></br>
              <strong>Deadline Column</strong>
              <br></br>
              The deadline column falls under the bolded 'Deadline' label. In
              this column, the deadline of the task is being displayed.
              <br></br>
              <br></br>
              <h3>Icons</h3>
              There are three icons under the Task List. Clicking on the icons
              would result in changes made to the Task List.
              <br></br>
              <br></br>
              <strong>Completing Tasks</strong>
              <br></br>
              Clicking on <TiTickOutline /> would result in the task being
              marked as 'complete'. All tasks that are marked as 'complete' will
              be transferred to the 'Task History' page.
              <br></br>
              <br></br>
              <strong>Deleting Tasks</strong>
              <br></br>
              Clicking on <AiOutlineDelete /> would result in the task being
              permanently deleted.
              <br></br>
              Do note that this action is irreversible, and once deleted, the
              task cannot be salvaged.Hence, users will be faced with a
              confirmation message to check if their action is really intended.
              <br></br>
              <br></br>
              The delete confirmation is different for Single and Routine tasks.
              <br></br>
              <br></br>
              For single tasks, users are simply faced with "Yes" and "No".
              <br></br>
              <br></br>
              However, for routine tasks, users would be asked if they want to
              delete the task along with future tasks, the task itself, or none
              of the above.
              <br></br>
              <br></br>
              <strong>Editing Tasks</strong>
              <br></br>
              Users can edit their tasks by clicking on the <MdModeEdit /> icon.
              The task insertion form will appear, and the task will be updated
              after the user makes the necessary update.
            </p>
            <p>
              <h2>Task Filtering</h2>
              Users can choose to filter out the tasks by selecting the relevant
              categories under 'Category Filter'.
              <br></br>
              Tasks without a 'Category' are labelled with the <RiChatOffLine />{" "}
              icon.
              <br></br>
              <br></br>
              Clicking on <RiAddBoxFill /> would cause tasks from all categories
              will be displayed on the TaskList.
              <br></br>
              Clicking on <RiCheckboxIndeterminateFill /> would cause the Task
              List to display no tasks, and reset the buttons to unselected.
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
              the top of the Task List.
              <br></br>
              <br></br>
              Selecting <em>Priority</em> will result in the tasks being sorted
              by priority. Tasks with the highest priority level will be placed
              at the top of the Task List.
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
export default TaskInfo;
