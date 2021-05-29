import logo from './Final Logo White.png';
import './App.css';
import {Button} from '@material-ui/core';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br></br>
        <p>
          <strong>Login via google</strong>
        </p>
        <Button variant = "contained" color = "primary">
          <b>Login</b>
        </Button>
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
} 

export default App;
