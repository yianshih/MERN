import React, { useEffect, useState, useRef } from 'react';
import {
    makeStyles,
    Button,
    Paper,
    Popper,
    MenuItem,
    MenuList,
    Grow,
    ClickAwayListener,
    InputBase,
    IconButton
} from '@material-ui/core';
import { useHistory, Link } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import { useQuery } from '@apollo/react-hooks';
import { SEARCH } from '../graphql/queries';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
}));

const MenuListComposition = () => {

    const history = useHistory()
    const classes = useStyles();
    const anchorRef = useRef(null);
    const [keyword, setKeyword] = useState()

    const { data, loading } = useQuery(SEARCH, {
        variables: { query: keyword }
    });

    const [open, setOpen] = useState(false);
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    useEffect(() => {
        if (!data) return 
        if (data.search.length > 0) setOpen(true)
        else setOpen(false)
    }, [data])

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const clickHandler = (event, id) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
        history.push(`/post/${id}`)
    }

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    console.log("data : ", data)
    return (
        <div className={classes.root}>
            <div>
                {/* <Button
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >Toggle Menu</Button> */}
                <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <IconButton
                            color="inherit"
                            //aria-label="add to shopping cart"
                            aria-controls="menu-list-grow">
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <InputBase
                        style={{ color: 'white' }}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search…"
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        inputProps={{ 'aria-label': 'search' }}
                    />
                </div>

                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}>
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={true} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        {data && data.search.map(post => (
                                            <MenuItem key={post._id} onClick={(e) => clickHandler(e, post._id)}>{post.content}</MenuItem>
                                        ))}
                                        {/* <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleClose}>My account</MenuItem>
                                        <MenuItem onClick={handleClose}>Logout</MenuItem> */}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}

export default MenuListComposition
