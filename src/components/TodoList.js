import React, { useState } from "react";
import Todo from "./Todo.js";
import TodoForm from "./TodoForm.js";

function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    const newTodos = [todo, ...todos];

    setTodos(newTodos);
  };

  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      return;
    }

    setTodos((prev) =>
      prev.map((item) => (item.id === todoId ? newValue : item))
    );
  };

  const removeTodo = (id) => {
    const removeArr = [...todos].filter((todo) => todo.id !== id);
    setTodos(removeArr);
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <div>
      <div
        className="Content-body"
        style={{
          "font-size": "30px",
          marginTop: "30px",
          color: "#696969",
          fontFamily: "Helvetica",
        }}
      >
        New Task
        <div className="Dashboard-body">
          <TodoForm onSubmit={addTodo} />
          <br></br>
        </div>
        Pending Tasks
        <div className="scroll-list">
          <Todo 
            todos={todos}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
          />
        </div>
      </div>
    </div>
  );
}
export default TodoList;
