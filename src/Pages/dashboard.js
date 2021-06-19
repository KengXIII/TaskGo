import "./dashboard.css";
import { Button } from "@material-ui/core";
import Sidebar from "../components/SideBar";
import TaskOverview from "../components/TaskManager/TaskOverview";
import { firebase } from "@firebase/app";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import TaskHistory from "../components/TaskHistory";
import Settings from "../components/Settings";
import Calendar from "../components/Calendar";
import Profile from "../components/Profile";

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
                  <TaskOverview />
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
