import "./dashboard.css";
import { Button } from "@material-ui/core";
import { IfFirebaseAuthed } from "@react-firebase/auth";
import TodoList from "../components/TodoList";
import Sidebar from "../components/SideBar";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import TaskHistory from "../components/TaskHistory";
import Settings from "../components/Settings";
import Calendar from "../components/Calendar";
import Profile from "../components/Profile";

function Dashboard() {
  const handleSignOut = (firebase) => {
    firebase.auth().signOut();
  };

  return (
    <Router>
      <div className="Dashboard">
        <div className="Left">
          <Profile />
          <Sidebar />
        </div>

        <div className="main">
          <div className="Topbar">
            <IfFirebaseAuthed>
              {({ firebase }) => (
                <Button
                  variant="contained"
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
