import React, { Component, PropTypes } from 'react';

class Login extends Component {
    login() {
        const {userName, password} = this.refs;
        this.props.actions.requestToken({
            userName: userName.value,
            password: password.value
        });
    }

    logout() {
        this.props.actions.logout();
    }

    render() {
        const {isAuthenticated, userInfo} = this.props;

        const logOutButton = isAuthenticated ? <button className='btn btn-default' onClick={() => this.logout()}>Logout</button> : null;
        const logInButton = isAuthenticated ? null : <button className='btn btn-default' onClick={() => this.login()}>Login</button>;

        const loginForm = isAuthenticated ? <p>Already logged in as {userInfo.userName}</p> :
                <form className='col-md-12'>
                    <div className='form-group'>
                        <input type='text' className='form-control input-lg' placeholder='User name' ref='userName' />
                    </div>
                    <div className='form-group'>
                        <input type='password' className='form-control input-lg' placeholder='Password' ref='password' />
                    </div>
                </form>;

        return (
            <div className='container'>
                {loginForm}
                {logInButton}
                {logOutButton}
            </div>
        );
    }
}

Login.propTypes = {
    actions: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    userInfo: PropTypes.object
};

export default Login;
