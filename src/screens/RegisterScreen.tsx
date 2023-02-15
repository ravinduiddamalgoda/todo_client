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
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

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
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    marginTop: '10px',
  },
  submitBtn: {
    marginTop: '15px',
  },
}));

export function RegisterPage() {
  const { classes } = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const makeRegistration = async (formData: any) => {
    try {
      const res = await axios.post('http://localhost:5000/register', {
        ...formData,
      });
      enqueueSnackbar('Succesfully Registered', { variant: 'success' });
      navigate('/login');
    } catch (err: any) {
      const error = err?.response?.data?.err || err.message;
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  return (
    <Box className={classes.root}>
      <Formik
        initialValues={{
          fname: '',
          lname: '',
          email: '',
          password: '',
        }}
        validationSchema={Yup.object().shape({
          fname: Yup.string().required('Required*'),
          lname: Yup.string().required(),
          email: Yup.string().email('Provide an valid email').required(),
          password: Yup.string()
            .min(5, 'Password must have minimum 5 characters')
            .required(),
        })}
        onSubmit={makeRegistration}
      >
        {({ values, errors, handleChange, handleSubmit }) => {
          return (
            <>
              <Typography variant="h3">Registration</Typography>
              <FormControl className={classes.formControl} variant="outlined">
                <TextField
                  value={values.fname}
                  onChange={handleChange}
                  name="fname"
                  label="First Name"
                  type="text"
                  size="small"
                  error={errors.fname && errors.fname?.length ? true : false}
                />
                <FormHelperText style={{ color: 'red' }}>
                  {errors.fname}
                </FormHelperText>
              </FormControl>
              <FormControl className={classes.formControl}>
                <TextField
                  value={values.lname}
                  onChange={handleChange}
                  name="lname"
                  label="Last Name"
                  type="text"
                  size="small"
                />
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
              <Button
                onClick={() => handleSubmit()}
                type="submit"
                className={classes.submitBtn}
                variant="contained"
              >
                Register
              </Button>
              <Box height={10}></Box>
              <Link to="/login">
                <Typography>Already Registered ? Click To login</Typography>
              </Link>
            </>
          );
        }}
      </Formik>
    </Box>
  );
}
