import React, { useState, useContext } from 'react';
//import ApolloClient from 'apollo-boost';
//import { gql } from 'apollo-boost';
import { useQuery, useLazyQuery, useSubscription, useMutation } from '@apollo/react-hooks';
//import { AuthContext } from '../context/authContext';
//import { useHistory } from 'react-router-dom';
import { GET_ALL_POSTS, TOTAL_POSTS, PROFILE } from '../graphql/queries';
import { POST_ADDED, POST_UPDATED, POST_DELETED } from '../graphql/subscriptions';
import PostCard from '../components/PostCard';
//import PostPagination from '../components/PostPagination';
import { toast } from 'react-toastify';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { ADD_LIKED, REMOVE_LIKED } from '../graphql/mutations';
import { AuthContext } from '../context/authContext';


const Home = () => {
  const [page, setPage] = useState(1);
  //const [open, setOpen] = useState(false);
  const { data, loading, error } = useQuery(GET_ALL_POSTS, {
    variables: { page }
  });
  const { data: postCount } = useQuery(TOTAL_POSTS);
  const { data: userProfile } = useQuery(PROFILE);
  const { state } = useContext(AuthContext);
  const { user } = state;
  // subscription > post added
  const { data: newPost } = useSubscription(POST_ADDED, {
    onSubscriptionData: async ({ client: { cache }, subscriptionData: { data } }) => {
      // console.log(data)
      // readQuery from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page }
      });
      // console.log(allPosts)

      // write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: [data.postAdded, ...allPosts]
        }
      });
      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }]
      });
      // show toast notification
      toast.success('New post!');
    }
  });
  // post updated
  const { data: updatedPost } = useSubscription(POST_UPDATED, {
    onSubscriptionData: () => {
      toast.success('Post updated!');
    }
  });
  // post deleted
  const { data: deletedPost } = useSubscription(POST_DELETED, {
    onSubscriptionData: async ({ client: { cache }, subscriptionData: { data } }) => {
      // console.log(data)
      // readQuery from cache
      const { allPosts } = cache.readQuery({
        query: GET_ALL_POSTS,
        variables: { page }
      });
      // console.log(allPosts)

      let filteredPosts = allPosts.filter((p) => p._id !== data.postDeleted._id);

      // write back to cache
      cache.writeQuery({
        query: GET_ALL_POSTS,
        variables: { page },
        data: {
          allPosts: filteredPosts
        }
      });
      // refetch all posts to update ui
      fetchPosts({
        variables: { page },
        refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }]
      });
      // show toast notification
      toast.error('Post deleted!');
    }
  });

  const [fetchPosts, { data: posts }] = useLazyQuery(GET_ALL_POSTS);

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
      refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }]
    })
  }

  const handleLikedRemove = async (postId) => {
    removeLiked({
      variables: { postId },
      refetchQueries: [{ query: GET_ALL_POSTS, variables: { page } }]
    })
  }

  if (loading) return (
    <Grid container justify="center" alignItems="center" spacing={5}>
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  );

  //console.log("postCount : ", postCount)
  //console.log("data : ", data)
  return (
    <Grid container justify="center" alignItems="center" spacing={5}>
      <Grid item xs={12}>
        <Grid container spacing={5} direction="row" justify="center" alignItems="stretch">
          {data && data.allPosts.length > 0
            ? user && userProfile
              ? data.allPosts.map((post) => {
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
              : data.allPosts.map((post) => {
                return (
                  <Grid item key={post._id}>
                    <PostCard
                      handleLikedAdd={handleLikedAdd}
                      handleLikedRemove={handleLikedRemove}
                      hideLiked={true}
                      post={post} />
                  </Grid>)
              })
            : <Typography style={{ margin: '20px' }}>No Post found</Typography>}
        </Grid>
      </Grid>
      {postCount && postCount.totalPosts > 0 &&
        <Grid item xs={12}>
          <Grid container justify="center">
            <Pagination
              page={page}
              onChange={(e, page) => setPage(page)}
              count={Math.ceil(postCount && postCount.totalPosts / 3)}
              color="primary" />
          </Grid>
        </Grid>}
    </Grid>
  );
};

export default Home;
