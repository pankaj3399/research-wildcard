import React, { useState, useEffect } from "react";
import data from "./data.json";
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data);
  }, []);

  const deleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };
  //TODO implement correct accept function 
  const acceptItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  return (
<div className="container mt-5">
      {items.map((item) => (
        <div key={item.id} className="card mb-3">
          <div className="card-body">
            <p className="card-title">{item.name}</p>
            <button className="btn btn-danger" onClick={() => deleteItem(item.id)}>
              <DeleteIcon /> Delete
            </button>
            <button className="btn btn-success ms-2" onClick={() => acceptItem(item.id)}>
              <DoneIcon /> Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;