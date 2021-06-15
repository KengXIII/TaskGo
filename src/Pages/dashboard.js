import "./dashboard.css";
import { Button } from "@material-ui/core";
import { IfFirebaseAuthed } from "@react-firebase/auth";
import TodoList from "../components/TodoList";
import Sidebar from "../components/SideBar";
import { firebase } from "@firebase/app";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import TaskHistory from "../components/TaskHistory";
import Settings from "../components/Settings";
import Calendar from "../components/Calendar";

function Dashboard() {
  const handleSignOut = (firebase) => {
    firebase.auth().signOut();
  };

  return (
    <Router>
      <div className="Dashboard">
        <div className="Left">
          <img
            src={firebase.auth().currentUser.photoURL}
            className="AvatarPic"
            style={{ display: "flex", borderRadius: "50%" }}
            alt="logo"
          />
          <div className="username">
            {firebase.auth().currentUser.displayName}
          </div>

          <Sidebar />
        </div>

        <div className="main">
          <div className="Topbar">
            <IfFirebaseAuthed>
              {({ firebase }) => (
                <Button
                  variant="contained"
                  style={{ float: "right", margin: "11px" }}
                  color="secondary"
                  className="logout-button"
                  onClick={() => handleSignOut(firebase)}
                >
                  <b>Logout</b>
                </Button>
              )}
            </IfFirebaseAuthed>
          </div>

          <div className="Content">
            <Switch>
              <Route exact path="/">
                <Redirect to="/dashboard" />
              </Route>
              <Route exact path="/dashboard">
                <TodoList />
              </Route>
              <Route exact path="/task-history">
                <TaskHistory />
              </Route>
              <Route exact path="/calendar">
                <Calendar />
              </Route>
              <Route exact path="/settings">
                <Settings />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Dashboard;
