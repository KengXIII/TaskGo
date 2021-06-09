import "./dashboard.css";
import { Button } from "@material-ui/core";
import { IfFirebaseAuthed } from "@react-firebase/auth";
import TodoList from "../components/TodoList";
import Sidebar from "../components/SideBar";
import Avatar from "../components/Avatar.png";

function Dashboard() {
  const handleSignOut = (firebase) => {
    firebase.auth().signOut();
  };

  return (
    <div className="Dashboard">
      <div className="Left">
        <img
          src={Avatar}
          className="AvatarPic"
          style={{ display: "flex" }}
          alt="logo"
        />
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
          <TodoList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
