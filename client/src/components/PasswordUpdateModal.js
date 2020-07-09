import React from 'react'
import clsx from 'clsx';
import {
    OutlinedInput,
    InputAdornment,
    InputLabel,
    FormControl,
    makeStyles,
    TextField,
    Grid,
    IconButton,
    Button,
    Modal,
    Backdrop,
    Fade,
    Typography
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    check: {
        color: 'green'
    },
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: '25ch',
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        //border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


const PasswordUpdateModal = props => {

    const classes = useStyles();

    const {
        setModalOpen,
        setNewPassword,
        newPassword,
        showPassword,
        setShowPassword,
        cancelHandler,
        passwordSubmitHandler,
        modalOpen,
        handleMouseDownPassword,
    } = props

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}>
            <Fade in={modalOpen}>
                <div className={classes.paper}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container justify="center">
                                <Typography variant="h6" component="h6">Reset Password</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify="center">
                                <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">New Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        labelWidth={70}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid
                                container
                                spacing={3}
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                            >
                                <Grid item xs={3}>
                                    <Button variant="outlined" color="secondary" onClick={cancelHandler}>Cancel</Button>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button variant="outlined" color="primary" onClick={passwordSubmitHandler}>Submit</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Fade>
        </Modal>
    )
}


export default PasswordUpdateModal