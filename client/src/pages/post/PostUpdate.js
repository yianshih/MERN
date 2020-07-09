import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { SINGLE_POST } from '../../graphql/queries';
import { POST_UPDATE } from '../../graphql/mutations';
import omitDeep from 'omit-deep';
import { useParams } from 'react-router-dom';
import FileUpload from '../../components/FileUpload';
import { CircularProgress, Typography, TextField, Grid, Button } from '@material-ui/core';

const PostUpdate = () => {
    const [values, setValues] = useState({
        title: '',
        content: '',
        images: []
    });
    const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
    const [postUpdate] = useMutation(POST_UPDATE);

    const [loading, setLoading] = useState(false);
    // router
    const { postid } = useParams();
    // destructure
    const { title, content, images } = values;

    useMemo(() => {
        if (singlePost) {
            setValues({
                ...values,
                _id: singlePost.singlePost._id,
                title: singlePost.singlePost.title,
                content: singlePost.singlePost.content,
                images: omitDeep(singlePost.singlePost.images, ['__typename'])
            });
        }
    }, [singlePost]);

    useEffect(() => {
        //console.log(postid);
        getSinglePost({ variables: { postId: postid } });
    }, []);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        postUpdate({ variables: { input: values } });
        setLoading(false);
        toast.success('Post Updated');
    };

    // const updateForm = () => (
    //     <form onSubmit={handleSubmit}>
    //         <div className="form-group">
    //             <textarea
    //                 value={content}
    //                 onChange={handleChange}
    //                 name="content"
    //                 rows="5"
    //                 className="md-textarea form-control"
    //                 placeholder="Write something cool"
    //                 maxLength="150"
    //                 disabled={loading}
    //             ></textarea>
    //         </div>

    //         <button className="btn btn-primary" type="submit" disabled={loading || !content}>
    //             Post
    //         </button>
    //     </form>
    // );

    return (
        <Grid container spacing={5} direction="column" justify="center" alignItems="stretch">
            <Grid item>
                {loading ?
                    <CircularProgress />
                    : <Typography variant="h4">Edit Post</Typography>}
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
                    <Button variant="outlined" onClick={handleSubmit} color="secondary" disabled={loading || !values.content}>Update</Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default PostUpdate;
