import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { AuthContext } from '../components/AuthProvider';

// TODO

//1. list all todods
//2. create todo
//3. update todo
//4. delete todo

export interface Todo {
  title: string
  user: string
  status: string
  _id: string
  createdAt: string
  updatedAt: string
  __v: number
}


const useStyles = makeStyles()(theme => ({
  root: {
    width: '80%',
    margin: '5% auto',
  },
}));

function TodoInput(props: { onNewTodoCreated: (todo: Todo) => void }) {
  const { client } = useContext(AuthContext);
  const {enqueueSnackbar } = useSnackbar();
  const [newTodo, setNewTodo] = useState('');

  async function createNewTodo() {
    try {
      if (newTodo.length < 1) {
        return;
      }
      const todoPayload = {
        title: newTodo,
      }
  
      if (client) {
        const res = await client.post('/todo/create', todoPayload);
        enqueueSnackbar('Todo Created', { variant: 'success' });
        props.onNewTodoCreated(res.data);
        setNewTodo('');
      }
    } catch(err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  }

  return (
    <TextField
      value={newTodo}
      placeholder="Add new todo"
      style={{ width: '100%' }}
      size="small"
      onChange={e => setNewTodo(e.target.value)}
      onKeyUp={(e) => {
        if (e.keyCode === 13) {
          createNewTodo();
        }
      }}
    />
  ); 
}

export function ProfilePage() {
  const { client } = useContext(AuthContext);
  const styles = useStyles();

  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const res = await client?.get<Todo[]>('/todo');
        if (res?.data) {
          setTodos(res?.data);
        }
      } catch(err) {

      }
    }
    init();
  }, []);

  return (
    <div className={styles.classes.root}>
      <TodoInput onNewTodoCreated={(todo) => setTodos(current => [...current, todo])}/>
      <ul>
        {todos.map((todo) => <li key={todo._id}>{todo.title}</li>)}
      </ul>
    </div>
  );
}
