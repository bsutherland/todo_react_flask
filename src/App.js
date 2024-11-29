import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('/todo').then(res => res.json()).then(data => {
      setTodos(data);
    });
  }, []);

  return (
    <div>
      <ol>
        {todos.map(todo => <ToDo todo={todo} setTodos={setTodos} />)}
        <ToDoInput setTodos={setTodos} />
      </ol>
    </div>
  );
}

function ToDoInput({ setTodos}) {
  const [todoText, setTodoText] = useState('');

  const addTodo = () => {
    fetch('/todo', {
      method: 'POST',
      headers:  { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: todoText})
    }).then(res => res.json()).then(data => setTodos(data));
  }

  return <li>
    <input
      type="text"
      name="todoText"
      onChange={ev => setTodoText(ev.target.value)}
    />
    <button onClick={(e) => addTodo()}>Add</button>
  </li>
}

function ToDo({ todo, setTodos }) {
  const toggleDone = (id) => {
    fetch(`/todo/${id}`, {
      method: 'PUT'
    }).then(res => res.json()).then(data => setTodos(data));;
  }

  return <li
    key={todo.id}
    onClick={() => toggleDone(todo.id)}
    style={{
      textDecoration: todo.done ? 'line-through' : 'none'
    }}
  >
    {todo.text}
  </li>;
};

export default App;
