import React, { useState } from 'react'
import { Alert, AlertTitle } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

const Toast = ({ open, toastHandleClose, severity, title, message }) => {

    //const [toastOpen, setToastOpen] = useState(open || true)
    //const [open, setOpen] = useState(true)

    return (
        <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={toastHandleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={toastHandleClose} severity={severity}>
                <AlertTitle>{title}</AlertTitle>
                {message}
            </Alert>
        </Snackbar>)
}

export default Toast