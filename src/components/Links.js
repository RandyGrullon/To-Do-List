import React, { useEffect, useState } from "react";
import LinkForm from "./LinkForm";
import { db } from "../firebase";
import {toast} from 'react-toastify'

const Links = () => {
  const [todos, setTodos] = useState([]);
  const [currentId, setCurrentId] = useState('');

  const addOrEditTask = async (linkObject) => {
    await db.collection("todos").doc().set(linkObject);
    toast('todo Added',{
      type: 'success'
    })
  };

  const onDeleteTask = async (id) => {
    if(window.confirm("Are you sure you want to delete the todo")){
      await db.collection("todos").doc(id).delete();
      toast('todo deleted',{
        type: 'error'
      })
    }
  };

  const getLinks = async () => {
    db.collection("todos").onSnapshot((querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ ...doc.data(), id: doc.id });
      });
      setTodos(docs);
    });
  };

  useEffect(() => {
    getLinks();
  }, []);

  return (
    <div>
      <LinkForm {...{addOrEditTask, currentId, todos}} />
      <div className="col-md-16">
        {todos.map((todo) => (
          <div className="card mb-2" key={todo.id}>
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4>{todo.todo}</h4>
               <div>
               <i
                  className="material-icons text-danger"
                  onClick={() => onDeleteTask(todo.id)}
                >
                  delete
                </i>
                <i
                  className="material-icons"
                  onClick={() => setCurrentId(todo.id)}
                >
                  create
                </i>
               </div>
              </div>
              <p>{todo.description}</p>
              <p>{todo.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Links;
