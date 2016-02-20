import React, { PropTypes } from 'react';

class AddUser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: null,
            realName: null,
            roles: null,
            email: null,
            password: null,
            passwordConfirm: null
        };
    }

    addUser() {
        const {userName, realName, roles, email, password} = this.state;

        this.props.addNewUser({
            userName,
            realName,
            roles: roles!==null ? roles.split(',') : roles,
            email,
            password
        });
    }

    render () {
        const addUserBtn = this.state.userName && this.state.email && this.state.password && this.state.password===this.state.passwordConfirm ?
        <button type='button' className='btn btn-warning' onClick={() => this.addUser()}>Add user</button> : null;

        return (
            <div className='well'>
                <form className='form-horizontal'>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>User name</label>
                        <div className='col-sm-10'>
                            <input type='text' className='form-control' placeholder='User name' value={this.state.userName} onChange={(e) => this.setState({userName: e.target.value})} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Email</label>
                        <div className='col-sm-10'>
                            <input type='email' className='form-control' placeholder='Email' value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Password</label>
                        <div className='col-sm-10'>
                            <input type='password' className='form-control' placeholder='Password' value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Confirm password</label>
                        <div className='col-sm-10'>
                            <input type='password' className='form-control' placeholder='Password' value={this.state.passwordConfirm} onChange={(e) => this.setState({passwordConfirm: e.target.value})} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Real name</label>
                        <div className='col-sm-10'>
                            <input type='text' className='form-control' placeholder='Real name' value={this.state.realName} onChange={(e) => this.setState({realName: e.target.value})} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label className='col-sm-2 control-label'>Roles</label>
                        <div className='col-sm-10'>
                            <input type='text' className='form-control' placeholder='Roles' value={this.state.roles} onChange={(e) => this.setState({roles: e.target.value})} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <div className='col-sm-offset-2 col-sm-10'>
                            {addUserBtn}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

AddUser.proptypes = {
    addNewUser: PropTypes.func.isRequired
};

export default AddUser;
