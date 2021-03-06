import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { FirebaseAuthProvider } from "@react-firebase/auth";
import { firebaseConfig } from "./config/firebaseConfig";
import { firebase } from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";

ReactDOM.render(
  <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
    <App />
  </FirebaseAuthProvider>,
  document.getElementById("root")
);
