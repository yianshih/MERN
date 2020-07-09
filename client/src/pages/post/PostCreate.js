import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
//import { AuthContext } from '../../context/authContext';
import { useQuery, useMutation } from '@apollo/react-hooks';
import FileUpload from '../../components/FileUpload';
import { POST_CREATE } from '../../graphql/mutations';
import { POSTS_BY_USER } from '../../graphql/queries';

import { CircularProgress, Typography, TextField, Grid, Button } from '@material-ui/core';

const initialState = {
    title: '',
    content: '',
    images: [
        {
            url: 'https://via.placeholder.com/200x200.png?text=Post',
            public_id: '123'
        }
    ]
    // image: {
    //     url: 'https://via.placeholder.com/200x200.png?text=Post',
    //     public_id: '123'
    // }
};

const PostCreate = () => {
    const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);
    //const [postContent, setPostContent] = useState('')
    // query
    //const { data: posts } = useQuery(POSTS_BY_USER);

    // destructure
    const { content, image } = values;

    // mutation
    const [postCreate] = useMutation(POST_CREATE, {
        // read query from cache / write query to cache
        update: (cache, { data: { postCreate } }) => {
            // read Query from cache
            const { postsByUser } = cache.readQuery({
                query: POSTS_BY_USER
            });
            // write Query to cache
            cache.writeQuery({
                query: POSTS_BY_USER,
                data: {
                    postsByUser: [postCreate, ...postsByUser]
                }
            });
        },
        onError: (err) => console.log(err)
    });

    const handleSubmit = async () => {
        //e.preventDefault();
        setLoading(true);
        postCreate({ variables: { input: values } });
        setValues(initialState);
        setLoading(false);
        toast.success('Post created');
    };

    const handleChange = (e) => {
        e.preventDefault();
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <Grid container spacing={5} direction="column" justify="center" alignItems="stretch">
            <Grid item>
                <Typography variant="h4">Create Post</Typography>
                {/* {loading ?
                    <CircularProgress />
                    : <Typography variant="h4">Create Post</Typography>} */}
            </Grid>
            <Grid item xs={12}>
                <FileUpload
                    values={values}
                    loading={loading}
                    setValues={setValues}
                    setLoading={setLoading}

                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    disabled={loading}
                    fullWidth
                    id="outlined-multiline-static"
                    label="Title"
                    name="title"
                    onChange={(e) => handleChange(e)}
                    value={values.title}
                    rows={8}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    disabled={loading}
                    fullWidth
                    id="outlined-multiline-static"
                    label="Content"
                    name="content"
                    multiline
                    onChange={(e) => handleChange(e)}
                    value={values.content}
                    rows={8}
                    variant="outlined"
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container justify="flex-end">
                    <Button variant="outlined" onClick={handleSubmit} color="secondary" disabled={loading || !values.content}>Post</Button>
                </Grid>
            </Grid>
        </Grid>
        // <div className="container p-5">
        //     {loading ?
        //         <CircularProgress />
        //         : <Typography variant="h4">Create Post</Typography>}

        //     <div className="row">
        //         <div className="col">{createForm()}</div>
        //     </div>
        // </div>
    );
};

export default PostCreate;
