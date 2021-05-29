import './App.css';
import Dashboard from './Pages/dashboard';
import Homepage from './Pages/homepage';

import {FirebaseAuthConsumer, IfFirebaseAuthed, IfFirebaseUnAuthed} from "@react-firebase/auth";

function App() {
  return (
    <div className="App">
      <FirebaseAuthConsumer>
        <IfFirebaseAuthed>
          <Dashboard />
        </IfFirebaseAuthed>
        <IfFirebaseUnAuthed>
          <Homepage />
        </IfFirebaseUnAuthed>
      </FirebaseAuthConsumer>
    </div>
  );
} 

export default App;
