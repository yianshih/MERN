import React, { useState, Fragment } from 'react';
//import clsx from 'clsx';
import {

    makeStyles,
    TextField,
    Grid,
    IconButton,
    Button,

} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
//import CheckCircleIcon from '@material-ui/icons/CheckCircle';
//import Visibility from '@material-ui/icons/Visibility';
//import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PasswordUpdateModal from '../PasswordUpdateModal'

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
    container: {
        marginTop: 20
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        //border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));


const UserProfile = ({ passwordUpdatehandler, handleSubmit, handleChange, username, name, email, about, loading }) => {
    const classes = useStyles();

    const [usernameDisabled, setUsernameDisabled] = useState(true)
    const [nameDisabled, setNameDisabled] = useState(true)
    const [aboutDisabled, setAboutDisabled] = useState(true)
    //const [showPasswordInput, setShowPasswordInput] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [modalOpen, setModalOpen] = useState(false);


    const changeHandler = (e) => {
        handleChange(e)
        setIsChanged(true)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const usernameEditHandler = () => {
        setUsernameDisabled(!usernameDisabled)
        // if (isChanged) {
        //     handleSubmit()
        //     setUsernameDisabled(!usernameDisabled)
        //     setIsChanged(false)
        // }
        // else setUsernameDisabled(!usernameDisabled)
    }

    const nameEditHandler = () => {
        setNameDisabled(!nameDisabled)
        // if (isChanged) {
        //     handleSubmit()
        //     setNameDisabled(!nameDisabled)
        //     setIsChanged(false)
        // }
        // else setNameDisabled(!nameDisabled)
    }

    const aboutEditHandler = () => {
        setAboutDisabled(!aboutDisabled)
        // if (isChanged) {
        //     handleSubmit()
        //     setAboutDisabled(!aboutDisabled)
        //     setIsChanged(false)
        // }
        // else setAboutDisabled(!aboutDisabled)
    }
    const updateHandler = () => {
        handleSubmit()
        setUsernameDisabled(true)
        setNameDisabled(true)
        setAboutDisabled(true)
        setIsChanged(false)
    }
    const cancelHandler = () => {
        setModalOpen(false)
        //setShowPasswordInput(false)
        setNewPassword('')
    }

    const passwordSubmitHandler = () => {
        setModalOpen(false)
        passwordUpdatehandler(newPassword)
    }

    return (
        <Fragment>
            <Grid className={classes.container} container spacing={5} direction="column" justify="flex-start" alignItems="flex-start">
                <Grid item>
                    <Button variant="outlined" color="primary" onClick={() => setModalOpen(true)}>Reset Password</Button>
                </Grid>
                <Grid item>
                    <Grid container direction="row">
                        <Grid item>
                            <TextField disabled={true} id="profile-email" label="Email" variant="outlined" name="email" value={email} />
                        </Grid>
                        <Grid item>
                            {/* <IconButton disabled color="primary" component="span">
                                <EditIcon />
                            </IconButton> */}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="row">
                        <Grid item>
                            <TextField
                                disabled={usernameDisabled}
                                id="profile-username"
                                label="Username"
                                variant="outlined"
                                name="username"
                                value={username || ''}
                                onChange={e => changeHandler(e)} />
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" component="span" onClick={usernameEditHandler}>
                                <EditIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="row">
                        <Grid item>
                            <TextField disabled={nameDisabled} id="profile-name" label="Name" variant="outlined" name="name" value={name || ''} onChange={e => changeHandler(e)} />
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" component="span" onClick={nameEditHandler}>
                                <EditIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="row">
                        <Grid item>
                            <TextField
                                fullWidth
                                id="user-outlined-multiline-static"
                                disabled={aboutDisabled}
                                label="About"
                                name="about"
                                multiline
                                onChange={e => changeHandler(e)}
                                value={about || ''}
                                rows={8}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item>
                            <IconButton color="primary" component="span" onClick={aboutEditHandler}>
                                <EditIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Button disabled={!isChanged} variant="outlined" color="secondary" onClick={updateHandler}>Update</Button>
                </Grid>
            </Grid>
            <PasswordUpdateModal
                setModalOpen={setModalOpen}
                setNewPassword={setNewPassword}
                newPassword={newPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                cancelHandler={cancelHandler}
                passwordSubmitHandler={passwordSubmitHandler}
                modalOpen={modalOpen}
                handleMouseDownPassword={handleMouseDownPassword}
            />
        </Fragment >
    )
};

export default UserProfile;
