import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

const AuthForm = ({
    email = '',
    password = '',
    loading,
    setEmail = (f) => f,
    setPassword,
    handleSubmit,
    showPasswordInput = false,
    hideEmailInput = false
}) => (
        <form>
            {!hideEmailInput && (
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        placeholder="Enter email"
                        disabled={loading}
                    />
                </div>
            )}

            {showPasswordInput && (
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter password"
                        disabled={loading}
                    />
                </div>
            )}
            {loading
                ? <CircularProgress />
                : <Button variant="outlined" color="primary" disabled={loading} onClick={handleSubmit}>
                Submit
        </Button>}
        </form>
    );

export default AuthForm;
