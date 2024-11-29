import React, { useState, useEffect } from 'react';
import './App.css';


function App() {
  const [todoText, setTodoText] = useState('');
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch('/todo').then(res => res.json()).then(data => {
      setTodos(data);
    });
  }, []);

  const addTodo = () => {
    fetch('/todo', {
      method: 'POST',
      headers:  { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: todoText})
    });
  }

  return (
    <div>
      <ol>
        {todos.map(todo => <ToDo todo={todo} />)}
        <li>
          <input
            type="text"
            name="todoText"
            onChange={ev => setTodoText(ev.target.value)}
          />
          <button onClick={(e) => addTodo()}>Add</button>
        </li>
      </ol>
    </div>
  );
}

function ToDo({ todo }) {
  const toggleDone = (id) => {
    fetch(`/todo/${id}`, {
      method: 'PUT'
    });
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
