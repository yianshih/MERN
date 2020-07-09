import React, { useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import RegisterForm from '../../components/forms/RegisterForm'
import { makeStyles, Container, CssBaseline, Typography } from '@material-ui/core';

const Register = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const config = {
            url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
            handleCodeInApp: true
        };
        try {
            const result = await auth.sendSignInLinkToEmail(email, config);
            console.log('result', result);
            
            toast.success(`Email is sent to ${email}. click the link to complete your registration.`);
            
            window.localStorage.setItem('emailForRegistration', email);
            
            setError('')
            setEmail('');
            setLoading('');
        } catch (error) {
            setError(error.message)
            setLoading('')
        }

    };

    const useStyles = makeStyles((theme) => ({
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        form: {
            width: '100%', 
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
                <Typography component="h1" variant="h5">Register</Typography>
                <RegisterForm
                    emailChangeHandler={setEmail}
                    handleSubmit={handleSubmit}
                    email={email}
                    error={error}
                    loading={loading}
                />
            </div>
        </Container>
    );
};

export default Register;
