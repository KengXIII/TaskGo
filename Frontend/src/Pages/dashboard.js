import "./dashboard.css";
import { Button } from "@material-ui/core";
import Sidebar from "../components/Others/SideBar";
import { firebase } from "@firebase/app";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Settings from "../components/Settings/Settings";
import Calendar from "../components/Calendar/Calendar";
import Profile from "../components/Others/Profile";
import TaskList from "../components/TaskManager/TaskList";
import TaskHistory from "../components/TaskHistory/TaskHistory";

function Dashboard() {
  return (
    <Router>
      <div className="Dashboard">
        <div className="Left">
          <Profile />
          <Sidebar />
        </div>

        <div className="main">
          <div className="Topbar">
            <Button
              variant="contained"
              style={{ float: "right", margin: "11px" }}
              color="secondary"
              className="logout-button"
              onClick={() => firebase.auth().signOut()}
            >
              <b>Logout</b>
            </Button>
          </div>

          <div className="Content">
            <div className="changingContents">
              <Switch>
                <Route exact path="/">
                  <Redirect to="/dashboard" />
                </Route>
                <Route exact path="/dashboard">
                  <TaskList />
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
      </div>
    </Router>
  );
}

export default Dashboard;
