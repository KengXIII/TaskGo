import { Button, Input} from "@material-ui/core";
import { useState } from "react";

function TodoForm(props) {
    const [input, setInput] = useState('');

    const handleChange = e => {
        setInput(e.target.value);
    }
    const handleSubmit = e => {
        e.preventDefault();
        // props.onSubmit({
        //     id: 0, 
        //     text: input
        // })
        setInput('');
    }

    return(
        <form className="todo-entrybox">
          <Input 
            style={{ margin: "0 1rem", color: "black", backgroundColor: "white", opacity:0.9, paddingLeft: "3px"}}
            placeholder='Enter Task Name'
            value={input}
            inputProps={{ 'aria-label': 'description' }}
            className='task-name'
            onChange={handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            className="submit-button"
            onClick={handleSubmit}
          >
          create task
          </Button>
        </form>
    )    
}

export default TodoForm;