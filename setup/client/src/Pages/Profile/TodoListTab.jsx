import React, { useState } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';

function TodoListTab() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleCheck = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        label="Add To-Do Item"
        variant="filled"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleAddTodo} variant="contained" sx={{ mt: 2 }}>Add</Button>
      <div>
        {todos.map((todo) => (
          <FormControlLabel
            control={<Checkbox checked={todo.completed} onChange={() => handleCheck(todo.id)} />}
            label={todo.text}
            key={todo.id}
          />
        ))}
      </div>
    </Box>
  );
}

export default TodoListTab;
