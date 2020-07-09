import React, { useContext, useState } from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import {
    Grid,
    makeStyles,
    Button,
    CircularProgress,
    GridList,
    GridListTile,
    GridListTileBar,
    IconButton,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    input: {
        display: 'none',
    },
    titleBar: {
        background: '#00000000',
    },
    img: {
        maxHeight: 200,
        maxWidth: 200,
        minWidth: 200,
    }
}));

const FileUpload = ({ image, userUpdate, setValues, setLoading, values, loading, singleUpload = false }) => {
    const { state } = useContext(AuthContext);
    const classes = useStyles();
    const [uploading, setUploading] = useState(false)

    const fileResizeAndUpload = (event) => {
        setLoading(true);
        setUploading(true);
        let fileInput = false;
        if (event.target.files[0]) {
            fileInput = true;
        }
        if (fileInput) {
            Resizer.imageFileResizer(
                event.target.files[0],
                200,
                200,
                'JPEG',
                100,
                0,
                (uri) => {
                    axios
                        .post(
                            `${process.env.REACT_APP_REST_ENDPOINT}/awsuploadimages`,
                            { image: uri },
                            {
                                headers: {
                                    authtoken: state.user.token
                                }
                            }
                        )
                        .then((response) => {
                            setLoading(false);
                            setUploading(false)
                            // setValues to parent component based on either it is
                            // used for single/multiple upload
                            if (singleUpload) {
                                // single upload
                                const newValues = { ...values, image: response.data }
                                userUpdate({ variables: { input: newValues } });
                                setValues({ ...values, image: response.data });
                            } else {
                                const { images } = values;
                                //const newValues = { ...values, images: [...images, response.data] }
                                //userUpdate({ variables: { input: newValues } });
                                setValues({ ...values, images: [...images, response.data] });
                            }
                        })
                        .catch((error) => {
                            setLoading(false);
                            console.log('AWS UPLOAD FAILED', error);
                        });
                },
                'base64'
            );
        }
    };

    const handleImageRemove = (id) => {
        //console.log("Removing ", id)
        if (id.toString() === '123') {
            if (singleUpload) {
                // single upload
                //const { image } = values;
                //const newValues = { ...values, image: '' }
                setValues({ ...values, image: { url: 'none', public_id: 'none' } });
                //userUpdate({ variables: { input: newValues } });
            } else {
                const { images } = values;
                //const newValues = { ...values, images: [...images].filter(img => img.public_id !== id) }
                //userUpdate({ variables: { input: newValues } });
                setValues({ ...values, images: [...images].filter(img => img.public_id !== id) });
            }

            return
        }
        setLoading(true);
        setUploading(true)
        axios
            .post(
                `${process.env.REACT_APP_REST_ENDPOINT}/awsremoveimage`,
                {
                    public_id: id
                },
                {
                    headers: {
                        authtoken: state.user.token
                    }
                }
            )
            .then((response) => {
                setLoading(false);
                setUploading(false);
                // setValues to parent component based on either it is
                // used for single/multiple upload
                console.log("response : ", response)
                if (response.data.deleted === 'OK') {
                    console.log('Resetting values')
                    if (singleUpload) {
                        // single upload
                        //const { image } = values;
                        //const newValues = { ...values, image: '' }
                        setValues({ ...values, image: '' });
                        //userUpdate({ variables: { input: newValues } });
                    } else {
                        const { images } = values;
                        //const newValues = { ...values, images: [...images].filter(img => img.public_id !== id) }
                        //userUpdate({ variables: { input: newValues } });
                        setValues({ ...values, images: [...images].filter(img => img.public_id !== id) });
                    }

                }

            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    };

    //console.log("Values : ", values)
    //console.log("image : ", image)
    const content = (
        <Grid container direction="column" justify="center" alignItems="center">
            <Grid item xs={12}>
                <Grid container direction="row" justify="flex-start" alignItems="center">
                    {singleUpload
                        ? values.image && values.image.public_id !== 'none' &&
                        <GridList className={classes.gridList} cols={1}>
                            <GridListTile key={values.image.public_id} className={classes.img}>
                                <img src={values.image.url} alt={values.image.public_id} />
                                <GridListTileBar
                                    //title={tile.title}
                                    classes={{
                                        root: classes.titleBar,
                                    }}
                                    actionIcon={
                                        <IconButton onClick={() => handleImageRemove(values.image.public_id)} aria-label={`star ${values.image.public_id}`}>
                                            <DeleteIcon color="secondary" className={classes.title} />
                                        </IconButton>
                                    }
                                />
                            </GridListTile>
                        </GridList>
                        : values.images && <GridList className={classes.gridList} cols={2.5}>
                            {values.images.map((image) => (
                                <GridListTile key={image.public_id} className={classes.img}>
                                    <img src={image.url} alt={image.public_id} />
                                    <GridListTileBar
                                        //title={tile.title}
                                        classes={{
                                            root: classes.titleBar,
                                        }}
                                        actionIcon={
                                            <IconButton onClick={() => handleImageRemove(image.public_id)} aria-label={`star ${image.public_id}`}>
                                                <DeleteIcon color="secondary" className={classes.title} />
                                            </IconButton>
                                        }
                                    />
                                </GridListTile>
                            ))}
                        </GridList>

                    }
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <input
                    accept="image/*"
                    className={classes.input}
                    onChange={fileResizeAndUpload}
                    id="contained-button-file"
                    multiple
                    type="file"
                />
                <label htmlFor="contained-button-file">
                    <div style={{ marginTop: 10 }}>
                        {uploading
                            ? <CircularProgress />
                            : <Button variant="outlined" color="primary" component="span">Upload</Button>}
                    </div>
                </label>
            </Grid>
        </Grid>
    )

    return content



};

export default FileUpload;
