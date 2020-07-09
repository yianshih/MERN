import React, { useContext, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { Container, Grid } from '@material-ui/core';

const PublicRoute = ({ ...rest }) => {
    const { state } = useContext(AuthContext);
    let history = useHistory();

    useEffect(() => {
        if (state.user) {
            history.push('profile');
        }
    }, [state.user]);

    return (
        <Container maxWidth="lg">
            <Route {...rest} />
        </Container>
    );
};

export default PublicRoute;
