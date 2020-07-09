import React, { useState, useMemo, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import { SINGLE_POST, PROFILE, POSTS_BY_USERNAME } from '../../graphql/queries';
import { useParams } from 'react-router-dom';
import PostCard from '../../components/PostCard';
import { Grid, Container, makeStyles, Typography, CircularProgress } from '@material-ui/core';
import { AuthContext } from '../../context/authContext';
import { ADD_LIKED, REMOVE_LIKED } from '../../graphql/mutations';

const useStyles = makeStyles((theme) => ({
    container: {
        justifyContent: 'center',
        display: "flex"
    },
}));

const SinglePost = () => {
    const { postid } = useParams();
    const { state } = useContext(AuthContext);
    const { user } = state;
    const { data: userProfile, loading } = useQuery(PROFILE);
    const classes = useStyles();
    const [values, setValues] = useState({
        title: '',
        content: '',
        images: [],
        postedBy: {},
        likedBy: []
    });
    const [getSinglePost, { data: singlePost }] = useLazyQuery(SINGLE_POST);
    // const { data: singlePost } = useQuery(SINGLE_POST,{
    //     variables: { postId: postid }
    // });
    // router

    // destructure
    //const { content, image } = values;
    //console.log("singlePost : ", singlePost)

    useEffect(() => {
        //console.log("singlePost : ", singlePost)
        if (singlePost) {
            setValues({
                ...values,
                _id: singlePost.singlePost._id,
                title: singlePost.singlePost.title,
                content: singlePost.singlePost.content,
                images: singlePost.singlePost.images,
                postedBy: singlePost.singlePost.postedBy,
                likedBy: singlePost.singlePost.likedBy
            });
        }
    }, [singlePost]);

    useEffect(() => {
        //console.log(postid);
        getSinglePost({ variables: { postId: postid } });
    }, [postid]);

    const [addLiked] = useMutation(ADD_LIKED, {
        update: ({ data }) => {
            //setToastToggle(true)
            //console.log('POST LIKED ADDED MUTATION', data)
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
            refetchQueries: [{ query: SINGLE_POST, variables: { postId: postid } }]
        })
    }

    const handleLikedRemove = async (postId) => {
        removeLiked({
            variables: { postId },
            refetchQueries: [{ query: SINGLE_POST, variables: { postId: postid } }]
        })
    }

    let renderCard = (
        <PostCard hideLiked={true} post={values} />
    )

    if (!singlePost) {
        renderCard = (
            <Typography style={{ marginTop: 20 }} variant="overline">Post Not Found</Typography>
        )
    }

    //console.log("values : ", values)
    if (singlePost && user && userProfile) {
        const isLiked = values && values.likedBy.some(u => u._id === userProfile.profile._id)
        renderCard = (
            <PostCard
                handleLikedAdd={handleLikedAdd}
                handleLikedRemove={handleLikedRemove}
                isLiked={isLiked}
                post={values} />)
    }

    if (loading) {
        return (
            <div className={classes.container}>
                <CircularProgress />
            </div>
        )
    }
    return (
        <div className={classes.container}>
            {renderCard}
        </div>
    );
};

export default SinglePost;
