import React from 'react';
//import ApolloClient from 'apollo-boost';
//import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
//import { AuthContext } from '../context/authContext';
//import { useHistory } from 'react-router-dom';
import { ALL_USERS } from '../graphql/queries';
import UserCard from '../components/UserCard';
import { Grid, CircularProgress, Typography } from '@material-ui/core';

const Users = () => {
  const { data, loading, error } = useQuery(ALL_USERS);

  if (error) return (
    <Grid container justify="center" alignItems="center">
      <Grid item>
        <Typography>{`Something went wrong ${error}`}</Typography>
      </Grid>
    </Grid>
  )

  if (loading) return (
    <Grid container justify="center" alignItems="center">
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  )

  return (
    <Grid container spacing={6} justify="center" alignItems="center">
      <Grid item xs={12}>
        <Grid container spacing={6} direction="row" justify="center" alignItems="stretch">
          {data && data.allUsers.map(user => (
            <Grid item key={user._id}>
              <UserCard user={user} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
    // <div className="container">
    //   <div className="row p-5">
    //     {data &&
    //       data.allUsers.map((user) => (
    //         <div className="col-md-4" key={user._id}>
    //           <UserCard user={user} />
    //         </div>
    //       ))}
    //   </div>
    // </div>
  );
};

export default Users;
