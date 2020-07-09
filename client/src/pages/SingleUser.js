import React, { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';
import UserCard from '../components/UserCard';
import { Grid, Typography, Container } from '@material-ui/core';
import { POSTS_BY_USERNAME, PROFILE } from '../graphql/queries';
import CircularProgress from '@material-ui/core/CircularProgress';
import PostCard from '../components/PostCard'
import { ADD_LIKED, REMOVE_LIKED } from '../graphql/mutations';
import { AuthContext } from '../context/authContext';

const PUBLIC_PROFILE = gql`
    query publicProfile($username: String!) {
        publicProfile(username: $username) {
            _id
            username
            name
            email
            image {
                url
                public_id
            }
            about
        }
    }
`;

//POSTS_BY_USERNAME
const SingleUser = () => {

    const { state } = useContext(AuthContext);
    const { user } = state;
    const { data: userProfile } = useQuery(PROFILE);
    let params = useParams();
    const { loading, data } = useQuery(PUBLIC_PROFILE, {
        variables: { username: params.username }
    });

    const { data: postsData } = useQuery(POSTS_BY_USERNAME, {
        variables: { username: params.username }
    })

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
            refetchQueries: [{ query: POSTS_BY_USERNAME, variables: { username: params.username } }]
        })
    }

    const handleLikedRemove = async (postId) => {
        removeLiked({
            variables: { postId },
            refetchQueries: [{ query: POSTS_BY_USERNAME, variables: { username: params.username } }]
        })
    }

    if (loading) return (
        <Grid container alignItems="center" direction="row" justify="center">
            <CircularProgress />
        </Grid>);

    //console.log("postsData : ", postsData)
    if (!data) {
        return (
            <Container>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center">
                    <Grid item>
                        <Typography style={{ color: 'grey' }} variant="subtitle1">User Not Found</Typography>
                    </Grid>
                </Grid>
            </Container>
        )
    }
    return (
        <Container>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center">
                <Grid item xs={6}>
                    {data && <UserCard user={data.publicProfile} />}
                </Grid>
            </Grid>
            <br />
            <Typography variant="h5" color="primary">{`${params.username} Posts`}</Typography>
            <hr />
            <Grid
                container
                spacing={5}
                justify="center"
                alignItems="center">
                {user && userProfile
                    ? postsData && postsData.postsByUsername.map(post => {
                        const isLiked = post.likedBy.some(u => u._id === userProfile.profile._id)
                        return (
                            <Grid item key={post._id}>
                                <PostCard
                                    handleLikedAdd={handleLikedAdd}
                                    handleLikedRemove={handleLikedRemove}
                                    isLiked={isLiked}
                                    post={post} />
                            </Grid>)
                    })
                    : postsData && postsData.postsByUsername.map(post => {
                        return (
                            <Grid item key={post._id} >
                                <PostCard
                                    hideLiked={true}
                                    post={post}
                                />
                            </Grid>)
                    })}
            </Grid>
        </Container>
    );
};

export default SingleUser;
