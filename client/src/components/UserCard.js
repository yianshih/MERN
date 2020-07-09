import React from 'react';
import { useHistory } from 'react-router-dom';
import {
    makeStyles,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    Grid,
    GridList,
    GridListTile,
    GridListTileBar
} from '@material-ui/core';

import { red } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        minWidth: 200
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
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
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background: '#00000000',
    },
}));


const UserCard = ({ user }) => {

    const { username, image, about } = user;

    const history = useHistory();
    //const { image, content, postedBy } = post;
    const classes = useStyles();

    return (
        <Grid container justify="center" alignItems="center">
            <Grid item>
                <Card className={classes.root}>
                    <CardHeader
                        avatar={
                            null
                            //<Avatar aria-label="recipe" className={classes.avatar}>{username[0]}</Avatar>
                        }
                        action={null}
                        title={
                            <Typography className={classes.username} color="primary" variant="h5" onClick={() => history.push(`/user/${username}`)}>
                                {username}
                            </Typography>

                        }
                    //subheader={`@${username}`} 
                    />
                    <CardMedia
                        className={classes.media}
                        image={image.url}
                        title="Paella dish" />
                    {/* <CardContent>
                        <div className={classes.imgContainer}>
                            <GridList className={classes.gridList} cols={images.length > 1 ? 1.5 : 1}>
                                {images.map((img) => (
                                    <GridListTile key={img.public_id}>
                                        <img src={img.url} alt={img.public_id} />
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
                    </CardContent> */}
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {about}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default UserCard;
