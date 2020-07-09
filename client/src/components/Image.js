import React from 'react';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
    container: {
        position: "relative",
        width: "100%",
    },
    img: {
        height: "auto",
    },
    btn: {
        position: "absolute",
        top: "75%",
        left: "75%",
    }
}))

const Image = ({ image, handleImageRemove = (f) => f }) => {
    const classes = useStyles()


    //console.log("image : ", image)

    return (
        <div className={classes.container}>
            <img
                src={image.url}
                key={image.public_id}
                alt={image.public_id}
                className={classes.img}
                onClick={() => handleImageRemove(image.public_id)}
            />
            {/* {<IconButton className={classes.btn} onClick={() => handleImageRemove(image.public_id)}>
                <DeleteIcon color="secondary" />
            </IconButton>} */}
        </div >)
};

export default Image;
