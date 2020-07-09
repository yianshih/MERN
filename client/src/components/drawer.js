import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import {
    makeStyles,
    SwipeableDrawer,
    Button,
    List,
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    IconButton,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home'
import MenuIcon from '@material-ui/icons/Menu'
import PeopleIcon from '@material-ui/icons/People'
import SettingsIcon from '@material-ui/icons/Settings';
import { AuthContext } from '../context/authContext';
import { auth } from 'firebase';
import ListAltIcon from '@material-ui/icons/ListAlt';

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
}));

const SwipeableTemporaryDrawer = () => {
    const classes = useStyles();
    const [open, setOpen] = useState(false)
    const { state, dispatch } = useContext(AuthContext);
    const history = useHistory();

    const { user } = state;

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpen(open)
        //setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListItem button onClick={() => history.push("/")}>
                    <ListItemIcon>
                        <ListAltIcon />
                    </ListItemIcon>
                    <ListItemText primary="Posts" />
                </ListItem>
                <ListItem button onClick={() => history.push("/users")}>
                    <ListItemIcon>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Community" />
                </ListItem>
                {/* <ListItem button onClick={() => history.push("/profile")}>
                    <ListItemIcon>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Account" />
                </ListItem> */}
            </List>
            {/* <Divider />
            <List>
                <ListItem button >
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List> */}
        </div>
    );

    return (
        <React.Fragment>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer("left", true)}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
            ><MenuIcon />
            </IconButton>
            {/* <Button onClick={toggleDrawer("left", true)}>left</Button> */}
            <SwipeableDrawer
                anchor="left"
                open={open}
                onClose={toggleDrawer("left", false)}
                onOpen={toggleDrawer("left", true)}
            >
                {list("left")}
            </SwipeableDrawer>
        </React.Fragment>

    );
}

export default SwipeableTemporaryDrawer