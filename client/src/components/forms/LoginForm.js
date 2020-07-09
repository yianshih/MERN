import React from 'react'
import { CircularProgress, makeStyles, Button, Link, TextField, Typography, Zoom, Grid } from '@material-ui/core';

const LoginForm = props => {

    const {
        emailChangeHandler,
        pwdChangeHandler,
        handleSubmit,
        googleLogin,
        loading,
        error,
        email,
        password
    } = props

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
    const classes = useStyles()

    return (
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
                onChange={emailChangeHandler}
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
                onChange={pwdChangeHandler}
            />
            {error &&
                <Zoom in={error !== null} timeout={1000}>
                    <Typography component="p" variant="subtitle1" color="error">
                        {error}
                    </Typography>
                </Zoom>
            }
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
                >Sign In</Button>}

            <Button
                fullWidth
                variant="outlined"
                color="primary"
                className={classes.submit}
                onClick={googleLogin}>
                <img alt="" style={{ marginRight: '10px' }} src={require(`../../assets/images/logo/google_logo.png`)} />
                <Typography>SIGN IN WITH GOOGLE</Typography>
            </Button>
            <Grid container alignItems="center" direction="row" justify="space-between">
                <Grid item>
                    <Link color="secondary" href="/password/forgot" variant="body2">
                        {"Forget your password?"}
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
        </form>
    )
}

export default LoginForm