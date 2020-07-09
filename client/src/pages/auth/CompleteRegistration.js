import React, { useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { useMutation } from '@apollo/react-hooks';
//import { gql } from 'apollo-boost';
//import AuthForm from '../../components/forms/AuthForm';
import { USER_CREATE } from '../../graphql/mutations';
import {
    CircularProgress,
    makeStyles,
    Button,
    TextField,
    Grid,
    Container
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),

        justifyItems: 'space-between'
    },
}))


const CompleteRegistration = () => {
    const { dispatch } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const classes = useStyles()
    let history = useHistory();

    useEffect(() => {
        setEmail(window.localStorage.getItem('emailForRegistration'));
    }, [history]);

    const [userCreate] = useMutation(USER_CREATE);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // validation
        if (!email || !password) {
            toast.error('Email and password is required');
            return;
        }
        try {
            const result = await auth.signInWithEmailLink(email, window.location.href);
            // console.log(result);
            if (result.user.emailVerified) {
                // remove email from local storage
                window.localStorage.removeItem('emailForRegistration');
                let user = auth.currentUser;
                await user.updatePassword(password);

                // dispatch user with token and email
                // then redirect
                const idTokenResult = await user.getIdTokenResult();
                dispatch({
                    type: 'LOGGED_IN_USER',
                    payload: { email: user.email, token: idTokenResult.token }
                });
                // make api request to save/update user in mongodb
                userCreate();
                history.push('/');
            }
        } catch (error) {
            console.log('register complete error', error.message);
            setLoading(false);
            toast.error(error.message);
        }
    };

    return (
        <Container>
            <Grid container justify="center">
                <Grid item>
                    <form className={classes.form} noValidate autoComplete="off">
                        <TextField
                            value={email}
                            id="login-email"
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={e => setEmail(e.target.value)}
                        />
                        <TextField
                            value={password}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => setPassword(e.target.value)}
                        />
                        {loading
                            ? <Grid container alignItems="center" direction="row" justify="center">
                                <CircularProgress />
                            </Grid>
                            : <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={handleSubmit}
                            >Submit</Button>}
                    </form>
                </Grid>
            </Grid>
        </Container>
        // <div className="contianer p-5">
        //     {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Complete Your Registration</h4>}
        //     <AuthForm
        //         email={email}
        //         setEmail={setEmail}
        //         password={password}
        //         setPassword={setPassword}
        //         loading={loading}
        //         handleSubmit={handleSubmit}
        //         showPasswordInput="true"
        //     />
        // </div>
    );
};

export default CompleteRegistration;
