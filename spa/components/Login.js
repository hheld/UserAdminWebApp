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

    onKeyUp(event) {
        if(event.keyCode===13) {
            this.login();
        }
    }

    render() {
        const {isAuthenticated, userInfo} = this.props;

        const logOutButton = isAuthenticated ? <button className='btn btn-default btn-xs' type='button' onClick={() => this.logout()}>Logout</button> : null;
        const logInButton = isAuthenticated ? null : <button className='btn btn-default' type='button' onClick={() => this.login()}>Login</button>;

        const loginForm = isAuthenticated ? <p>Already logged in as {userInfo.userName} {logOutButton}</p> :
                <form className='form-horizontal well'>
                    <div className='form-group'>
                        <label className='control-label col-sm-2'>User name</label>
                        <div className='col-sm-10'>
                            <input type='text' className='form-control input-xs' placeholder='User name' ref='userName' onKeyUp={(event) => this.onKeyUp(event)} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='control-label col-sm-2'>Password</label>
                        <div className='col-sm-10'>
                            <input type='password' className='form-control input-xs' placeholder='Password' ref='password' onKeyUp={(event) => this.onKeyUp(event)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            {logInButton}
                        </div>
                    </div>
                </form>;

        return (
            <div className='container'>
                {loginForm}
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
