import { React, useEffect, useState } from "react";
import firebase from "@firebase/app";
import { Button, Input, Switch } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import SettingsInfo from "./SettingsInfo";

function Settings() {
  const [settings, setSettings] = useState([]);
  const [newSettings, setNewSettings] = useState([{ notification: true }]);
  const [loaded, setLoaded] = useState(false);
  const [success, setSuccess] = useState(false);
  const uid = firebase.auth().currentUser?.uid;
  const db = firebase.firestore();
  const docRef = db.collection("/users").doc(uid);

  useEffect(() => {
    docRef.onSnapshot((doc) => {
      const temp = doc.data().settings[0];
      setSettings({
        notification: temp.notification,
        email: temp.email,
        historyCleanUp: temp.historyCleanUp,
        reminderDays: temp.reminderDays,
      });

      setNewSettings({
        notification: temp.notification,
        email: temp.email,
        historyCleanUp: temp.historyCleanUp,
        reminderDays: temp.reminderDays,
      });
    });
    setLoaded(true);
  }, []);

  useEffect(() => {
    setNewSettings(settings);
  }, [settings]);

  function handleChange(event) {
    setNewSettings({
      ...newSettings,
      [event.target.name]: event.target.checked,
    });
  }

  function updateSettings(event) {
    event.preventDefault();
    const temp = [
      {
        notification: newSettings.notification,
        email: newSettings.email,
        historyCleanUp: newSettings.historyCleanUp,
        reminderDays: newSettings.reminderDays,
      },
    ];
    docRef.update({ settings: temp });
    setSuccess(true);
  }

  if (!loaded) {
    return null;
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ width: "40%" }}>
          <h2>
            Settings
            <SettingsInfo
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "1rem",
                fontSize: "medium",
              }}
            />
          </h2>
          <form
            onSubmit={(event) => {
              updateSettings(event);
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <span style={{ flex: "40%" }}>Notifications:</span>
              <span style={{ flex: "80%" }}>
                <Switch
                  checked={newSettings.notification || ""}
                  name="notification"
                  onChange={handleChange}
                />
              </span>
            </div>
            <br></br>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <span style={{ flex: "40%" }}>Notification email:</span>
              <span style={{ flex: "80%" }}>
                <Input
                  style={{ marginInlineStart: "10px" }}
                  value={newSettings.email}
                  onChange={(event) => {
                    setNewSettings({
                      ...newSettings,
                      email: event.target.value,
                    });
                  }}
                  fullWidth={true}
                />
              </span>
            </div>
            <br></br>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <span style={{ flex: "40%" }}>History Clean:</span>
              <span style={{ flex: "80%" }}>
                <Input
                  // Input a short description for the task.
                  type="number"
                  inputProps={{ min: 1 }}
                  style={{ marginInlineStart: "10px", width: "20%" }}
                  value={newSettings.historyCleanUp}
                  onChange={(event) => {
                    setNewSettings({
                      ...newSettings,
                      historyCleanUp: event.target.value,
                    });
                  }}
                  fullWidth={true}
                />
              </span>
            </div>
            <br></br>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <span style={{ flex: "40%" }}>Notification days prior:</span>
              <span style={{ flex: "80%" }}>
                <Input
                  // Input a short description for the task.
                  type="number"
                  style={{ marginInlineStart: "10px", width: "20%" }}
                  inputProps={{ min: 1 }}
                  value={newSettings.reminderDays}
                  onChange={(event) => {
                    setNewSettings({
                      ...newSettings,
                      reminderDays: event.target.value,
                    });
                  }}
                  fullWidth={true}
                />
              </span>
            </div>
            <br></br>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Save Settings
              </Button>
              <Button
                onClick={() =>
                  setNewSettings({
                    email: firebase.auth().currentUser?.email,
                    reminderDays: 1,
                    historyCleanUp: 7,
                    notification: true,
                  })
                }
                variant="contained"
                color="secondary"
                style={{ marginLeft: "20px" }}
              >
                Default
              </Button>
            </div>
          </form>
        </div>
        {success ? (
          <Alert
            style={{
              marginLeft: "auto",
              height: "5%",
              float: "right",
            }}
            onClose={() => setSuccess(false)}
          >
            Settings updated successfully!
          </Alert>
        ) : null}
      </div>
    );
  }
}

export default Settings;
