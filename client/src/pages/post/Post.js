import React, { useState, Fragment } from 'react';
import { toast } from 'react-toastify';
//import { AuthContext } from '../../context/authContext';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { POST_CREATE, POST_DELETE, ADD_LIKED, REMOVE_LIKED } from '../../graphql/mutations';
import { POSTS_BY_USER, PROFILE } from '../../graphql/queries';
import PostCard from '../../components/PostCard';
import {
    CircularProgress,
    Grid,
    Typography,
} from '@material-ui/core';

// const initialState = {
//     content: '',
//     image: {
//         url: 'https://via.placeholder.com/200x200.png?text=Post',
//         public_id: '123'
//     }
// };

const Post = () => {
    //const [values, setValues] = useState(initialState);
    const [loading, setLoading] = useState(false);
    // query
    const { data: posts } = useQuery(POSTS_BY_USER);
    const [open, setOpen] = useState(false);
    //const [isLiked, setIsLiked] = useState(false) 
    
    const { data: userProfile } = useQuery(PROFILE);

    // destructure
    //const { content, image } = values;

    // mutation

    const [postDelete] = useMutation(POST_DELETE, {
        update: ({ data }) => {
            console.log('POST DELETE MUTATION', data);
            toast.error('Post deleted');
        },
        onError: (err) => {
            console.log(err);
            toast.error('Post delete failed');
        }
    });

    const toastHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const [addLiked] = useMutation(ADD_LIKED, {
        update: ({ data }) => {
            //setToastToggle(true)
            console.log('POST LIKED ADDED MUTATION', data)
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const [removeLiked] = useMutation(REMOVE_LIKED, {
        update: ({ data }) => {
            console.log('POST LIKED REMOVE MUTATION', data)
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const handleLikedAdd = async (postId) => {
        addLiked({
            variables: { postId },
            refetchQueries: [{ query: POSTS_BY_USER }]
        })
    }

    const handleLikedRemove = async (postId) => {
        removeLiked({
            variables: { postId },
            refetchQueries: [{ query: POSTS_BY_USER }]
        })
    }

    const handleDelete = async (postId) => {
        setLoading(true);
        postDelete({
            variables: { postId },
            refetchQueries: [{ query: POSTS_BY_USER }]
        });
        setLoading(false);
        //let answer = window.confirm('Delete?');
        // if (answer) {
        //     setLoading(true);
        //     postDelete({
        //         variables: { postId },
        //         refetchQueries: [{ query: POSTS_BY_USER }]
        //     });
        //     setLoading(false);
        // }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    // const handleClose = () => {
    //     setOpen(false);
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     postCreate({ variables: { input: values } });
    //     setValues(initialState);
    //     setLoading(false);
    //     toast.success('Post created');
    // };

    // const handleChange = (e) => {
    //     e.preventDefault();
    //     setValues({ ...values, [e.target.name]: e.target.value });
    // };

    // const createForm = () => (
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
        <Fragment>
            {loading ? <CircularProgress /> : <Typography variant="h4">My Posts</Typography>}
            <hr />
            {/* <Toast
                severity="success"
                title="Liked"
                message="Post Liked"
                open={toastToggle}
                toastHandleClose={toastHandleClose} /> */}
            <Grid container spacing={5}>
                {posts && userProfile && posts.postsByUser.map(post => {
                    const isLiked = post.likedBy.some(u => u._id === userProfile.profile._id)
                    return (<Grid item key={post._id} xs={4}>
                        <PostCard
                            isLiked={isLiked}
                            loading={loading}
                            post={post}
                            handleDelete={handleDelete}
                            handleLikedAdd={handleLikedAdd}
                            handleLikedRemove={handleLikedRemove}
                            showUpdateButton={true}
                            showDeleteButton={true}
                            handleClickOpen={handleClickOpen}
                        />
                    </Grid>)
                })}
            </Grid>

        </Fragment>
    );
};

export default Post;
