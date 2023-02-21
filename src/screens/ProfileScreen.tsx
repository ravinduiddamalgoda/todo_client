import { CheckBox, Height, Label, Margin } from '@mui/icons-material';
import {
  Box,
  Button,
  Input,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Menu,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router';
import TabUnstyled from '@mui/base/TabUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import MenuUnstyled from '@mui/base/MenuUnstyled';
import MenuItemUnstyled from '@mui/base/MenuItemUnstyled';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import axios, { AxiosPromise } from 'axios';
import { boolean } from 'yup';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { AuthContext } from '../components/AuthProvider';
import { blue } from '@mui/material/colors';
import Stack from '@mui/system/Stack';
import { styled } from '@mui/styles';
import clsx from 'clsx';
import { alignProperty } from '@mui/material/styles/cssUtils';
import { borders } from '@mui/system';
import Checkbox from '@mui/material/Checkbox';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'dark' ? '#1A2027' : '#fff',
  padding: '2px',
  textAlign: 'center',
  color: 'dark',
}));

// TODO

//1. list all todods
//2. create todo
//3. update todo
//4. delete todo

export interface Todo {
  title: string;
  user: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const useStyles = makeStyles()(theme => ({
  root: {
    width: '80%',
    margin: '5% auto',
    //background: '#1976D2'
  },

  textEnter: {
    maxWidth: '50%',
    paddingLeft: '26%',
    paddingright: '20%'
  },

  h1_wellcome: {
    fontSize: '20px',
    color: 'white',
    paddingRight: '40%',
  },
  item_s: {
    color: 'white',
    textAlign: 'center',
  },
  li_style: {
    borderLeft: 1 ,
    borderWidth: '10px',
    //borderLeftColor: "#3C5186" ,
    borderColor: '#3C5186',
    borderRadius: '6px',
    listStyleType: 'none',
    //background : 'rgb(25,103,210,0.3)',
    color: 'Black',
    margin:'14px',
    width: '70%',
    //height: '30vh',
    //border : 
    
   
  },
  button_col: {
    fontSize: '12px',
    color: 'black',
    alignContent: 'flex-end',
    alignItems: 'end',
    ":hover": {
      backgroundColor: 'rgb(25,118,210, 0.5)',
      color: 'white'
    }
    
  },
  btnBox :{
   paddingLeft: '70%',
   paddingTop : '8%'
  },

  li_text: {
    fontFamily: '"Segoe UI"',
    paddingRight: '40%',
    paddingLeft: '2%',
    fontSize : '20px',
    fontWeight: '700'
  },
  li_text_done: {
    fontFamily: '"Segoe UI"',
    paddingRight: '50%',
    textDecoration: 'line-through',
    paddingLeft: '2%',
    fontSize : '20px',
    fontWeight: '700'
  },
  button_at: {
    color: 'black',
    
  },

  liBox: {
    paddingLeft: '22%',
    paddingRight : '10%',
    
    width : '80%'
  },
  liBoxSize: {
    paddingLeft: '22%',
    paddingRight : '10%',
    
    width : '80%'
  },

  liBoxLarge: {
    borderLeft: 1 ,
    borderWidth: '10px',
    //borderLeftColor: "#3C5186" ,
    borderColor: '#3C5186',
    borderRadius: '6px',
    listStyleType: 'none',
    background : 'rgb(25,103,210,0.3)',
    color: 'Black',
    margin:'14px',
    width: '70%',
    height: '30vh',
    

  },

  inputText: {
    width: '80%',
    border: "none",
    margin: "none",
  
  } ,
  
  arrowStyle: {
    fontSize : '150',
    marginLeft: "2%",
    paddingLeft: '3%',
    paddingTop: "2%",
    color: '#7F4BAF',
    ":hover": {
      backgroundColor: 'rgb(107, 87, 176)',
      color: 'white'
    }
  },
  arrowStyleSmall: {
    fontSize : '150',
    marginLeft: "2%",
    paddingLeft: '3%',
    paddingTop: "2%",
    color: '#7F4BAF',
    ":hover": {
      backgroundColor: 'rgb(107, 87, 176)',
      color: 'white'
    },
    alignSelf: 'end'
  }

}));

function TodoInput(props: { onNewTodoCreated: (todo: Todo) => void }) {
  const { client } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [newTodo, setNewTodo] = useState('');
  const styles = useStyles();
  async function createNewTodo() {
    try {
      if (newTodo.length < 1) {
        return;
      }
      const todoPayload = {
        title: newTodo,
      };

      if (client) {
        const res = await client.post('/todo/create', todoPayload);
        enqueueSnackbar('Todo Created', { variant: 'success' });
        props.onNewTodoCreated(res.data);
        setNewTodo('');
      }
    } catch (err) {
      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
  }

  return (
    <TextField
      className={styles.classes.textEnter}
      value={newTodo}
      placeholder="Add new todo"
      style={{ width: '100%' , borderStyle: 'hidden' }}
      size="small"
      onChange={e => setNewTodo(e.target.value)}
      onKeyUp={e => {
        if (e.keyCode === 13) {
          createNewTodo();
        }
      }}
    />
  );
}

var res_data: String;

function TodoEditName(props: {tId:String , tName:String} ){
  const { client } = useContext(AuthContext);
  const styles = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const[val,setVal] = useState(props.tName);

  const path = 'todo/' + props.tId;
  async function setNewTodoName(){
    try{
      if (val.length < 1) {
        return;
      }
      if (client) {
        const res = await client.put(path, { title: val });
        enqueueSnackbar('Sucessfully Edited', { variant: 'success' });
      }

    }
    catch(err){

      enqueueSnackbar('Something went wrong', { variant: 'error' });
    }
}


  return(
    <>
      <TextField
        className= {styles.classes.inputText}
        value = {val}
        onChange={e => setVal(e.target.value)}
        onKeyUp={e => {
          if (e.keyCode === 13) {
            setNewTodoName();
          }
        }}
        />
    
    </>

  );



}




export function ProfilePage() {


  
  const { client } = useContext(AuthContext);
  const token = useContext(AuthContext);
  const styles = useStyles();
  // app bar
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = async () => {
      const res: any = await axios
        .get('http://localhost:5000/current-user', {
          headers: {
            Authorization: 'Bearer ' + token.token,
          },
        })
        .then(res => {
          res_data = res.data.fname;
          // console.log(res_data);
        });
    };

    if (token) currentUser();
  }, [token]);

  const settings = ['Account', 'My Todos', 'Logout'];

  const logout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const expandfunc = () => {
    return (
      <MenuUnstyled>
        <MenuItemUnstyled>{settings[0]}</MenuItemUnstyled>
        <MenuItemUnstyled>{settings[1]}</MenuItemUnstyled>
      </MenuUnstyled>
    );
  };

  const app_load = () => {
    navigate('/app');
    window.location.reload();
  };

  //todo content
  const [todos, setTodos] = useState<Todo[]>([]);
  const [donetodo, setDonetodo] = useState<Todo[]>([]);
  useEffect(() => {
    async function init() {
      try {
        const res = await client?.get<Todo[]>('/todo');
        if (res?.data) {
          const dataCpy = res?.data;
          //const doneTodotemp = dataCpy.filter(item => item.status === 'done');
          //const nonDone = dataCpy.filter(item => item.status !== 'done');
          //setDonetodo(doneTodotemp);
          setTodos(dataCpy);
        }
      } catch (err) {}
    }
    init();
  }, []);

  function Del_todo(tad: String, client: any) {
    const path_val = 'todo/' + tad;
    async function Delete_val() {
      try {
        if (client) {
          console.log('delted Item id', tad);
          console.log('all todos', todos);

          const res = await client.delete(path_val);

          const todosCpy = [...todos];
          //const todoCpyDone = [...donetodo];
          const filteredTodos = todosCpy.filter(item => item._id !== tad);
          //const filterDone = todoCpyDone.filter(item => item._id !== tad);
          setTodos(filteredTodos);
          //setDonetodo(filterDone);

          enqueueSnackbar('Sucessfully Deleated', { variant: 'success' });
        }
      } catch (err) {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      }
    }

    Delete_val();
  }


  //var stat:String = "pending"; 
  function edit_todo(todo_id: String, client: any , stat:String) {
    const path_val = 'todo/' + todo_id;
    async function edit_val() {
      try {
        if (client) {
          const res = await client.put(path_val, { status: stat });
          enqueueSnackbar('Sucessfully Edited', { variant: 'info' });
          console.log(stat);
          //const prevData = [...todos];
          //const prevEdit = [...donetodo];
          //const editDetail = prevData.filter(item => item._id === todo_id);
          //const newNonDoneTodo = prevData.filter(item => item._id !== todo_id);
          //setTodos(newNonDoneTodo);

          //

          //setDonetodo(prevEdit.concat(editDetail));
          //setDonetodo(edit_detail)
          //console.log(setDonetodo);
          //prevData.push()

          //window.location.reload();
        }
      } catch (err) {
        enqueueSnackbar('Error', { variant: 'error' });
      }
    }

    edit_val();
  }

  


  //const [todoCard , setTodoCard] = useState(1);
  
  function TodoCard(props: { todoData : Todo}){
    
    //const tempCard = false;
    const [card , setCard] = useState(false);
    //const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const [checked, setChecked] = useState(false);
    const handleChange = (id:String) => {
      setChecked(!checked)
      var statTemp:String;
      if(checked === false)
        statTemp = "done";
      else
      statTemp = "pending";
     
     

        edit_todo(id, client , statTemp);

    };


    if(card === false ){
      
    return (
      <>
       <Box className ={styles.classes.liBox}>
            
            <Box key={props.todoData._id} className={styles.classes.li_style}>
            <Checkbox checked={checked} onChange={() => handleChange(props.todoData._id)}/>
            
              <Typography
                className={clsx(
                  styles.classes.li_text,
                  checked == true && styles.classes.li_text_done
                )}
                display="inline"
              >
                {' '}
                {props.todoData.title}
              </Typography>
              <Button startIcon= {<KeyboardDoubleArrowUpIcon/>} className= {styles.classes.arrowStyleSmall} onClick = {() => setCard(!card)}></Button>
              
            </Box>
            </Box>
      
      </>

    );
    }
    else{
      return (
        <>
        <Box className ={styles.classes.liBoxSize}>
          
          <Box key={props.todoData._id} className={styles.classes. liBoxLarge}>
            <TodoEditName tId = { props.todoData._id } tName = {props.todoData.title} />
            {/* <ArrowDownwardIcon className= {styles.classes.arrowStyle} onClick = {() => {alert("clicked")}}/> */}
            <Button startIcon= {<KeyboardDoubleArrowUpIcon/>} className= {styles.classes.arrowStyle} onClick = {() => setCard(!card)}></Button>
            <Box className={styles.classes.btnBox}>
            
            <Button
              className={styles.classes.button_col}
              onClick={() => {
                Del_todo(props.todoData._id, client);
              }}
            >
             
              Delete
            </Button>

            <Button
              className={styles.classes.button_col}
              onClick={() => {
                Del_todo(props.todoData._id, client);
              }}
            >
             
              Cancel
            </Button>

            </Box>
            
          </Box>
          </Box>
        
         </>
    );

    }

     


  }

 
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx = {{background: "linear-gradient(118deg, rgba(65,112,180,1) 17%, rgba(130,74,175,1) 96%)"}}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={expandfunc}
            ></IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              onClick={app_load}
            >
              TODO App
            </Typography>
            <Typography variant="h1" className={styles.classes.h1_wellcome}>
              Wellcome {res_data}
            </Typography>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
      <div className={styles.classes.root}>
        <TodoInput
          onNewTodoCreated={todo => setTodos(current => [...current, todo])}
        />
         
          {todos.map(todo => (

            <TodoCard todoData={todo}/>
            
          ))}
        
      </div>
    </>
  );
}
