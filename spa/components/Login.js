import React, { Component, PropTypes } from 'react';

class Login extends Component {
    login() {
      const {userName, password} = this.refs;
      this.props.actions.requestToken({
        userName: userName.value,
        password: password.value
      });
    }

    render() {
      return (
          <div className='container'>
              <form className='col-md-12'>
                  <div className='form-group'>
                      <input type='text' className='form-control input-lg' placeholder='User name' ref='userName' />
                  </div>
                  <div className='form-group'>
                      <input type='password' className='form-control input-lg' placeholder='Password' ref='password' />
                  </div>
              </form>
              <button className='btn btn-default' onClick={() => this.login()}>Login</button>
          </div>
      );
    }
}

Login.propTypes = {
  actions: PropTypes.object.isRequired
};

export default Login;
