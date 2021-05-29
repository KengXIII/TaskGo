import "./dashboard.css";
import { Button } from "@material-ui/core";
import { IfFirebaseAuthed} from "@react-firebase/auth";

function Dashboard() {
  const handleSignOut = (firebase) => {
    firebase.auth().signOut();
  };
  return (
    <div className="Dashboard">
      <header className="Dashboard-header">
        <p>
          <strong>Welcome!</strong>
        </p>
          <IfFirebaseAuthed>
          {({ firebase }) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSignOut(firebase)}
            >
              <b>Logout</b>
            </Button>
            )}
          </IfFirebaseAuthed>
      </header>
    </div>
  );
}

export default Dashboard;
