import React, { useContext, useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import LoadingToRedirect from './LoadingToRedirect';
import { Container, Grid } from '@material-ui/core';

const PrivateRoute = ({ ...rest }) => {
    const { state } = useContext(AuthContext);
    const [user, setUser] = useState(false);

    useEffect(() => {
        if (state.user) {
            setUser(true);
        }
    }, [state.user]);

    const navLinks = () => (
        <nav>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                        Profile
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/password/update">
                        Password
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/post/create">
                        Post
                    </Link>
                </li>
            </ul>
        </nav>
    );

    const renderContent = () => (
        <div className="container-fluid pt-5">
            <div className="row">
                {/* <div className="col-md-3">{navLinks()}</div> */}
                <div className="col-md-9">
                    <Route {...rest} />
                </div>
            </div>
        </div>
    );

    const content = () => (
        <Container maxWidth="lg">
            <Route {...rest} />
        </Container>
    )

    return user ? content() : <LoadingToRedirect path="/login" />;
};

export default PrivateRoute;
