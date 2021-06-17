import { firebase } from "@firebase/app";

export default function Profile() {
  return (
    <div>
      <img
        src={firebase.auth().currentUser.photoURL}
        className="AvatarPic"
        alt="logo"
      />
      <div className="username">{firebase.auth().currentUser.displayName}</div>
    </div>
  );
}
