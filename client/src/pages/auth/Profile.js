import React, { useState, useMemo, Fragment, useContext } from 'react';
import { toast } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import omitDeep from 'omit-deep';
import { PROFILE } from '../../graphql/queries';
import { USER_UPDATE } from '../../graphql/mutations';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import UserProfile from '../../components/forms/UserProfile';
import FileUpload from '../../components/FileUpload';
import { Container, Grid, CircularProgress, Typography } from '@material-ui/core';
import { auth } from '../../firebase';

const Profile = () => {
    const { state } = useContext(AuthContext);
    const [values, setValues] = useState({
        username: '',
        name: '',
        email: '',
        about: '',
        image: {}
    });
    const [loading, setLoading] = useState(false);

    const { data } = useQuery(PROFILE);

    useMemo(() => {
        if (data) {
            //console.log(data.profile);
            setValues({
                ...values,
                username: data.profile.username,
                name: data.profile.name,
                email: data.profile.email,
                about: data.profile.about,
                image: omitDeep(data.profile.image, ['__typename'])
            });
        }
    }, [data]);

    // mutation
    const [userUpdate] = useMutation(USER_UPDATE, {
        update: ({ data }) => {
            console.log('USER UPDATE MUTATION IN PROFILE', data);
            toast.success('Profile updated');
        }
    });

    // destructure
    const { username, name, email, about, images } = values;

    const handleSubmit = () => {
        // console.log(values);
        setLoading(true);
        userUpdate({ variables: { input: values } });
        setLoading(false);
    };

    const passwordUpdatehandler = async (password) => {
        setLoading(true);
        auth.currentUser
            .updatePassword(password)
            .then(() => {
                setLoading(false);
                toast.success('Passowrd updated');
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error.message);
            });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // console.log(values);
    //     setLoading(true);
    //     userUpdate({ variables: { input: values } });
    //     setLoading(false);
    // };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <Container>
            {loading
                ? <CircularProgress />
                : <Fragment><Typography variant="h5" color="primary">{`Profile`}</Typography>
                    <hr /></Fragment>}
            <Grid container spacing={5} direction="row" justify="space-around">
                <Grid item>
                    <FileUpload
                        singleUpload={true}
                        userUpdate={userUpdate}
                        handleSubmit={handleSubmit}
                        setValues={setValues}
                        setLoading={setLoading}
                        values={values}
                        loading={loading} />
                </Grid>
                <Grid item>
                    <UserProfile
                        {...values}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        passwordUpdatehandler={passwordUpdatehandler} />
                </Grid>
            </Grid>
        </Container>);
};

export default Profile;
