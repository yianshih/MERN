import React from 'react'
import { CircularProgress, makeStyles, Button, Link, TextField, Typography, Zoom, Grid } from '@material-ui/core';

const LoginForm = props => {

    const {
        handleSubmit,
        emailChangeHandler,
        loading,
        error,
        email,
    } = props

    const useStyles = makeStyles((theme) => ({
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
        <form className={classes.form} noValidate autoComplete="off">
            <TextField
                value={email}
                id="register-email"
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => emailChangeHandler(e.target.value)}
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
                >Submit</Button>}
            <Grid container alignItems="center" direction="row" justify="flex-end">
                <Grid item>
                    <Link href="/login" variant="body2">
                        {"Already have an account? Login"}
                    </Link>
                </Grid>
            </Grid>
        </form>
    )
}

export default LoginForm