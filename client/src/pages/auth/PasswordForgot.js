import React, { useState } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import AuthForm from '../../components/forms/AuthForm';
import {
    makeStyles,
    TextField,
    Grid,
    Typography,
    Button,
} from '@material-ui/core';

const PasswordForgot = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const config = {
            url: process.env.REACT_APP_PASSWORD_FORGOT_REDIRECT,
            handleCodeInApp: true
        };

        await auth
            .sendPasswordResetEmail(email, config)
            .then(() => {
                setEmail('');
                setLoading(false);
                toast.success(`Email is sent to ${email}. Click on the link to reset your password`);
            })
            .catch((error) => {
                setLoading(false);
                console.log('error on password forgot email', error);
            });
    };

    const content = (
        <div className="contianer p-5">
            {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Forgot Password </h4>}
            <AuthForm email={email} setEmail={setEmail} loading={loading} handleSubmit={handleSubmit} />
        </div>
    )

    return (
        <Grid container direction="column" justify="center" alignItems="center">
            <Grid item>
                <Typography variant="h6" component="h6">Forgot Password</Typography>
            </Grid>
            <Grid item>
                <Typography variant="overline">Enter your email to reset your password</Typography>
            </Grid>

            <Grid item>
                <TextField
                    value={email}
                    variant="outlined"
                    margin="normal"
                    required
                    name="email"
                    label="Email"
                    type="text"
                    id="email"
                    autoComplete="current-password"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </Grid>
            <Grid item>
                <Button color="primary" variant="contained" onClick={handleSubmit}>Submit</Button>
            </Grid>
        </Grid>
    );
};

export default PasswordForgot;
