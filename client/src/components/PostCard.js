import React, { Fragment, useState } from 'react';
import Image from './Image';
import { Link, useHistory } from 'react-router-dom';
import {
    makeStyles,
    Card,
    CardHeader,
    //CardMedia,
    CardActions,
    CardContent,
    Avatar,
    Typography,
    IconButton,
    MenuItem,
    Menu,
    ListItemIcon,
    Dialog,
    DialogContent,
    DialogContentText,
    Button,
    DialogTitle,
    DialogActions,
    GridList,
    GridListTile,
    GridListTileBar
} from '@material-ui/core';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import UnFavoriteIcon from '@material-ui/icons/FavoriteBorder';

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        minWidth: 200,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
    },
    title: {
        display: "inline-block",
        cursor: 'pointer',
        "&:hover": {
            opacity: 0.6
        }
    },
    username: {
        display: "inline-block",
        cursor: 'pointer',
        "&:hover": {
            opacity: 0.6
        }
    },
    imgContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    titleBar: {
        background: '#00000000',
    },

}));

const PostCard = ({ hideLiked, handleLikedRemove, handleLikedAdd, isLiked, loading, post, handleDelete = (f) => f, showUpdateButton = false, showDeleteButton = false }) => {

    const history = useHistory();
    const { title, images, content, postedBy } = post;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setAnchorEl(null);
        setOpen(true);
    };

    const handleDialogClose = () => {
        setOpen(false);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteHandler = () => {
        setOpen(false)
        setAnchorEl(null);
        handleDelete(post._id)
    };

    const editHandler = () => {
        setAnchorEl(null);
        history.push(`/post/update/${post._id}`)
    }

    const likedClickHandler = () => {
        if (isLiked) handleLikedRemove(post._id)
        else handleLikedAdd(post._id)
    }

    //console.log("image : ", image)
    //console.log("post : ", post)
    return (
        <Fragment>
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        //<Avatar aria-label="recipe" className={classes.avatar}>A</Avatar>
                        <Avatar aria-label="recipe" className={classes.avatar}>{postedBy.username ? postedBy.username[0] : 'U'}</Avatar>
                    }
                    action={
                        (showUpdateButton || showDeleteButton) &&
                        <IconButton
                            aria-haspopup="true"
                            aria-controls="simple-menu"
                            aria-label="settings"
                            onClick={handleClick}>
                            <MoreVertIcon />
                        </IconButton>}
                    title={<Fragment><Typography variant="h6" color="primary" className={classes.title} onClick={() => history.push(`/post/${post._id}`)}>{title}</Typography><br /></Fragment>}
                    subheader={<Fragment><Typography variant="body2" className={classes.username} onClick={() => history.push(`/user/${postedBy.username}`)}>{`@${postedBy.username}`}</Typography><br /></Fragment>} />
                {/* {post && image.url && image.url !== 'none' &&
                    <CardMedia
                        className={classes.media}
                        image={image.url}
                        title="" />} */}
                <CardContent>
                    <div className={classes.imgContainer}>
                        <GridList className={classes.gridList} cols={images.length > 1 ? 1.5 : 1}>
                            {images.map((img) => (
                                <GridListTile key={img.public_id}>
                                    <img src={img.url} alt={img.public_id}/>
                                    <GridListTileBar
                                        title={null}
                                        classes={{
                                            root: classes.titleBar,
                                            title: classes.title,
                                        }}
                                        actionIcon={null}
                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </CardContent>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {content}
                    </Typography>
                </CardContent>
                {!hideLiked &&
                    <CardActions disableSpacing>
                        <IconButton aria-label="add to favorites" onClick={likedClickHandler}>
                            {isLiked
                                ? <FavoriteIcon color="secondary" />
                                : <UnFavoriteIcon color="secondary" />}
                        </IconButton>
                    </CardActions>
                }

            </Card>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                {showUpdateButton && (
                    <MenuItem onClick={editHandler}>
                        <ListItemIcon>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography variant="inherit">Edit</Typography>
                    </MenuItem>
                )}
                {showDeleteButton && (
                    <MenuItem
                        onClick={handleClickOpen}
                    //onClick={deleteHandler}
                    >
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <Typography variant="inherit" color="secondary">Delete</Typography>
                    </MenuItem>
                )}
            </Menu>
            <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This Post will be deleted forever
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">Cancel</Button>
                    <Button onClick={deleteHandler} color="secondary">delete</Button>
                </DialogActions>

            </Dialog>
        </Fragment>
    );
};

export default PostCard;
