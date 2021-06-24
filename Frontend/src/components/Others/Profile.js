import { firebase } from "@firebase/app";

export default function Profile() {
  return (
    <div>
      <img
        src={firebase.auth().currentUser?.photoURL}
        className="AvatarPic"
        style={{ display: "flex", borderRadius: "50%" }}
        alt="logo"
      />
      <div className="username">{firebase.auth().currentUser?.displayName}</div>
    </div>
  );
}
