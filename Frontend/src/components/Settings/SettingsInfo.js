import React, { useState } from "react";
import { Button, Dialog, DialogTitle } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

function SettingsInfo() {
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
          <label style={{ fontSize: "30px" }}>Settings</label>
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
              The Settings page is where users can choose to change the way
              TaskGo works.
              <br></br>
              <br></br>
              <strong>Notifications</strong>
              <br></br>
              By toggling the Notifications button, user can choose whether or
              not they want to receive Notifications to their email.
              <br></br>
              <br></br>
              <strong>Notification email</strong>
              <br></br>
              This is the email that users would want to receive their
              notifications in.
              <br></br>
              <br></br>
              <strong>History clean</strong>
              <br></br>
              This is where users can choose to alter the number of days the
              task will stay in the Task History page.
              <br></br>
              <br></br>
              <strong>Notification days prior</strong>
              <br></br>
              This is where users can choose to alter time where the
              notification of the task will be sent by inputting the number of
              days in this field.
              <br></br>
              <br></br>
              <strong>Save Settings</strong>
              <br></br>
              After making changes to the Settings page, users must click on
              Save Settings to save all the changes made.
              <br></br>
              Not doing so would result in no change done to the Settings in
              TaskGo.
              <br></br>
              <br></br>
              <strong>Default</strong>
              <br></br>
              All of the settings will be changed back to their default values
              after hitting this button.
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
export default SettingsInfo;
