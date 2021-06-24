import axios from "axios";
import { VscDiffAdded } from "react-icons/vsc";

function Settings() {
  const handleSend = async () => {
    try {
      await axios.post("http://localhost:4000/send_mail");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <strong>Settings</strong>
      <VscDiffAdded onClick={handleSend} />
    </div>
  );
}

export default Settings;
