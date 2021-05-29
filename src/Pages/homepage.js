import logo from "./Final Logo White.png";
import "./homepage.css";
import { Button } from "@material-ui/core";
import { FirebaseAuthConsumer } from "@react-firebase/auth";

function Homepage() {
  const handleGoogleSignIn = (firebase) => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider);
  };

  return (
    <div className="Homepage">
      <header className="Homepage-header">
        <img src={logo} className="Homepage-logo" alt="logo" />
        <br></br>
        <p>
          Login via google
        </p>
        <FirebaseAuthConsumer>
          {({ firebase }) => (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGoogleSignIn(firebase)}
            >
              <b>Login</b>
            </Button>
          )}
        </FirebaseAuthConsumer>
      </header>
    </div>
  );
}

export default Homepage;
