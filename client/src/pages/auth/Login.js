import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, googleAuthProvider } from '../../firebase';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
//import AuthForm from '../../components/forms/AuthForm';
import { USER_CREATE } from '../../graphql/mutations';
import LoginForm from '../../components/forms/LoginForm'
import { makeStyles, Paper, Container, CssBaseline, Button, TextField, Typography, Zoom, Grid } from '@material-ui/core';

const Login = () => {
    const { dispatch } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('')

    let history = useHistory();

    const [userCreate] = useMutation(USER_CREATE);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('')
        try {
            await auth.signInWithEmailAndPassword(email, password).then(async (result) => {
                const { user } = result;
                const idTokenResult = await user.getIdTokenResult();

                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token }
                });

                // send user info to our server mongodb to either update/create
                userCreate();
                history.push('/');
            });
        } catch (error) {
            setError(error.message)
            console.log('login error', error);
            //toast.error(error.message);
            setLoading(false);
        }
    };

    const emailChangeHandler = (e) => {
        setEmail(e.target.value)
        setError(null)
    }

    const pwdChangeHandler = (e) => {
        setPassword(e.target.value)
        setError(null)
    }

    const googleLogin = () => {
        auth.signInWithPopup(googleAuthProvider).then(async (result) => {
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();

            dispatch({
                type: 'LOGGED_IN_USER',
                payload: { email: user.email, token: idTokenResult.token }
            });

            // send user info to our server mongodb to either update/create
            userCreate();
            history.push('/');
        });
    };

    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),

            justifyItems: 'space-between'
        },
    }))
    const classes = useStyles()

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <LoginForm
                    emailChangeHandler={emailChangeHandler}
                    pwdChangeHandler={pwdChangeHandler}
                    handleSubmit={handleSubmit}
                    googleLogin={googleLogin}
                    email={email}
                    password={password}
                    loading={loading}
                    error={error}
                />
            </div>
        </Container>
    );
};

export default Login;
