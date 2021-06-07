import "./dashboard.css";
import { Button } from "@material-ui/core";
import { IfFirebaseAuthed } from "@react-firebase/auth";
import TodoList from "../components/TodoList";

function Dashboard() {
  const handleSignOut = (firebase) => {
    firebase.auth().signOut();
  };

  return (
    <div className="Dashboard">
    <br></br>
      <div className="logout-button" style={{ display: "flex"}}>
        <IfFirebaseAuthed>
          {({ firebase }) => (
            <Button
              variant="contained"
              style={{ marginLeft: "auto", marginRight: "10px"}}
              color="secondary"
              onClick={() => handleSignOut(firebase)}
            >
              <b>Logout</b>
            </Button>
          )}
        </IfFirebaseAuthed>
      </div>

      <h1 style={{ "font-size": "40px" }} className="Dashboard-header">
        <strong>What would you like to do?</strong>
      </h1>

      <body className="Dashboard-body">
        <TodoList />
      </body>
    </div>
  );
}

export default Dashboard;
