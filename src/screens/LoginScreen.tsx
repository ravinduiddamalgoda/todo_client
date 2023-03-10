import { Label } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  TextField,
  Typography,
  Container
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../components/AuthProvider';

function parseCustomApiError(error: any) {
  if (error && error.message) {
    return error.message.replace('>', '');
  }
  return 'Something Went Wrong';
}

const useStyles = makeStyles()(theme => ({
  root: {
    [theme.breakpoints.up('md')]: {
      width: '30%',
    },
    [theme.breakpoints.down('md')]: {
      width: '60%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '95%',
    },
    marginTop: '7%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '5%',
    height: '60vh',
    display: 'flex',
    flexDirection: 'column',
    paddingTop:'2%',
    paddingBottom: '0',
    borderColor: 'black',
    background: "white",
    borderRadius: '6px',
    borderBlockWidth :'thick'
  
  },
  loginPage: {
    paddingTop:'1%',
    maxWidth:'100%',
    maxHeight: '100%',
    paddingBottom: '4%',
    //background: rgb(65,112,180);
    background: 'linear-gradient(71deg, rgba(65,112,180,0.8829656862745098) 0%, rgba(130,74,175,0.9277836134453782) 72%)'
    //background
   

  },

  formControl: {
    marginTop: '10px',
    padding: '3%'
  },
  submitBtn: {
    marginTop: '15px',
    marginLeft : '5%',
    marginRight : '5%'
  },
  login: {
    fontFamily: '"Segoe UI"',
    paddingLeft: '28%'

  }
}));

export function LoginPage() {
  const { classes } = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  let { init } = useContext(AuthContext);

  const saveToken = async (payload: { token: string; life: number }) => {
    await localStorage.setItem('token', JSON.stringify(payload));
  };

  const makeRegistration = async (formData: any) => {
    try {
      const res = await axios.post('http://localhost:5000/login', {
        ...formData,
      });
      await saveToken(res.data);
      enqueueSnackbar('Succesfully Logged In', { variant: 'success' });
      init && (await init());
      navigate('../app');
    } catch (err: any) {
      const error = err?.response?.data?.err || err.message;
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  return (
    <Container className={classes.loginPage}>
      <Box className={classes.root}>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Provide an valid email').required(),
            password: Yup.string().required(),
          })}
          onSubmit={makeRegistration}
        >
          {({ values, errors, handleChange, handleSubmit }) => {
            return (
              <>
                <Typography variant="h3" className={classes.login} >Login</Typography>
                <FormControl className={classes.formControl}>
                  <TextField
                    value={values.email}
                    onChange={handleChange}
                    name="email"
                    label="Email"
                    type="email"
                    size="small"
                    error={errors.email && errors.email?.length ? true : false}
                  />
                  <FormHelperText style={{ color: 'red' }}>
                    {errors.email}
                  </FormHelperText>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    value={values.password}
                    onChange={handleChange}
                    name="password"
                    label="Password"
                    type="password"
                    size="small"
                  />
                </FormControl>
                <Button
                  onClick={() => handleSubmit()}
                  type="submit"
                  className={classes.submitBtn}
                  variant="contained"
                >
                  Login
                </Button>
                <Box height={10} />
                <Link to="/register">
                  <Typography sx ={{paddingLeft:'15%' , color: '#2691D9' , textDecoration: 'none'}}>New User ? Click To register</Typography>
                </Link>
              </>
            );
          }}
        </Formik>
      </Box>
    </Container>
  );
}
