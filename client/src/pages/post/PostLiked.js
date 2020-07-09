import React, { useState, Fragment } from 'react';
//import { toast } from 'react-toastify';
//import { AuthContext } from '../../context/authContext';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { ADD_LIKED, REMOVE_LIKED } from '../../graphql/mutations';
import { PROFILE, POSTS_BY_LIKED } from '../../graphql/queries';

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

const PostLiked = () => {
    
    const { data: posts, loading } = useQuery(POSTS_BY_LIKED);

    const [open, setOpen] = useState(false);
    //const [isLiked, setIsLiked] = useState(false) 
    const { data: userProfile } = useQuery(PROFILE);


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
            refetchQueries: [{ query: POSTS_BY_LIKED }]
        })
    }

    const handleLikedRemove = async (postId) => {
        removeLiked({
            variables: { postId },
            refetchQueries: [{ query: POSTS_BY_LIKED }]
        })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    if (loading) return (
        <Grid style={{ marginTop: 50 }} container spacing={5} justify="center">
            <CircularProgress />
        </Grid>
    )

    //console.log("posts : ", posts)
    return (
        <Fragment>
            <Typography style={{ marginTop: 50 }} variant="h4">My Liked Posts</Typography>
            <hr />
            <Grid container spacing={5} justify="center">
                {posts && userProfile && posts.postsByLiked.length === 0 &&
                    <Grid item xs={12}>
                        <Typography variant="overline">No Liked Posts</Typography>
                    </Grid>}
                {posts && userProfile && posts.postsByLiked.map(post => {
                    const isLiked = post.likedBy.some(u => u._id === userProfile.profile._id)
                    return (<Grid item key={post._id} >
                        <PostCard
                            isLiked={isLiked}
                            loading={loading}
                            post={post}
                            handleLikedAdd={handleLikedAdd}
                            handleLikedRemove={handleLikedRemove}
                            handleClickOpen={handleClickOpen}
                        />
                    </Grid>)
                })}
            </Grid>

        </Fragment>
    );
};

export default PostLiked;
