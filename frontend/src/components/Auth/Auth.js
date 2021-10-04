import React, {useState} from 'react';
import {Provider, useDispatch} from 'react-redux';
import {createStore } from 'redux';
import { useHistory } from 'react-router';
import { GoogleLogin } from 'react-google-login';
import { Avatar, Button, Paper, Grid, Typography, Container} from '@material-ui/core';
import useStyles from './styles'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Input from './Input';
import Icon from './icon';
import { AUTH } from '../../constants/actionTypes';
import authReducer from '../../reducers/auth';
import {signin, signup } from '../../actions/auth'
const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const AuthWrapper = () => {
  const store = createStore(authReducer);

  return (
    <Provider store={store}> 
      <Auth /> 
    </Provider>
  )
}
const Auth = () => {

  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const handleSubmit = (e) => {
    console.log(form);
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(form, history));
    } else {
      dispatch(signin(form, history));
    }
  };

const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
const [showPassword, setShowPassword] = useState(false);
const handleShowPassword = () => setShowPassword(!showPassword);

const switchMode = () => {
    setForm(initialState);  
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: AUTH, data: { result, token } });

      history.push('/');
    } catch (error) {
      console.log(error);
    }
  };
    const googleError = (err) => {
      console.log("Google Sign In was unsuccessful. Try again later")
    }
//   const googleError = () => alert('Google Sign In was unsuccessful. Try again later');
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            { isSignup && (
            <>
              <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
              <Input name="lastName" label="Last Name" handleChange={handleChange} half />
            </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In' }
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </Button>
              <GoogleLogin
            clientId="230273820459-r55a4ovaogkbmsnac01kaotucj0au6c0.apps.googleusercontent.com"
            render={(renderProps) => (
              <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                Google Sign In
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleError}
            cookiePolicy="single_host_origin"
          />
            </Grid>
          </Grid>
          </form>
            </Paper>
        </Container>
    )
}

export default AuthWrapper