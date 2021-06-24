import logo from "../components/Final Logo White.png";
import "./homepage.css";
import { Button } from "@material-ui/core";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AccountBox from "@material-ui/icons/AccountBox";

function Homepage() {
  const handleGoogleSignIn = (firebase) => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider);
  };

  return (
    <div className="Homepage">
      <div>
        <img
          src={logo}
          className="Homepage-logo"
          style={{ display: "block" }}
          alt="logo"
        />
      </div>

      <div>
        <div className="Homepage-header">
          <p>Login via Google</p>
        </div>
        <FirebaseAuthConsumer>
          {({ firebase }) => (
            <Button
              style={{margin: '0 auto', display: "flex"}}
              className="login-button"
              variant="contained"
              color="primary"
              startIcon={<AccountBox />}
              onClick={() => handleGoogleSignIn(firebase)}
            >
              <b>Login</b>
            </Button>
          )}
        </FirebaseAuthConsumer>
      </div>
    </div>
  );
}

export default Homepage;
