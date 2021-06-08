import logo from "./Final Logo White.png";
import "./homepage.css";
import { Button } from "@material-ui/core";
import { FirebaseAuthConsumer } from "@react-firebase/auth";
import AccountBox from "@material-ui/icons/AccountBox"

function Homepage() {
  const handleGoogleSignIn = (firebase) => {
    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleAuthProvider);
  };

  return (
    <div className="Homepage">

      <img src={logo} className="Homepage-logo" style={{ display: "flex"}} alt="logo"/>
      
      <header className="Homepage-header">
        <p>
          Login via google
        </p>
      </header>

      <body>
      <FirebaseAuthConsumer>
          {({ firebase }) => (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AccountBox />}
              onClick={() => handleGoogleSignIn(firebase)}
            >
              <b>Login</b>
            </Button>
          )}
        </FirebaseAuthConsumer>
      </body>
    </div>
  );
}

export default Homepage;
