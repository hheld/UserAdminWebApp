import React, { PropTypes } from 'react';
import ChangeUserPassword from './ChangeUserPassword';

class EditUser extends React.Component {
    initState(props) {
        const {user} = props;
        const {userName, email, realName, roles} = user;

        this.setState({
            userName: userName,
            email: email,
            realName: realName,
            roles: roles
        });
    }

    constructor(props) {
        super(props);

        const {user} = this.props;
        const {userName, email, realName, roles} = user;

        this.state = {
            userName: userName,
            email: email,
            realName: realName,
            roles: roles
        };
    }

    componentWillReceiveProps(nextProps) {
        this.initState(nextProps);
    }

    updateUser() {
        const updatedUserData = Object.assign({}, this.state, {
            id: this.props.user.id,
            roles: this.state.roles.length<2 ? this.state.roles : this.state.roles.split(/\s*,\s*/)
        });

        this.props.updateUser(updatedUserData);
    }

    render () {
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
                        <label className='col-sm-2 control-label'>Email</label>
                        <div className='col-sm-10'>
                            <input type='email' className='form-control' placeholder='Email' value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} />
                        </div>
                    </div>
                    <div className='form-group'>
                        <div className='col-sm-offset-2 col-sm-10'>
                            <button type='button' className='btn btn-warning' onClick={() => this.updateUser()}>Update user</button>
                        </div>
                    </div>
                </form>
                <ChangeUserPassword updatePasswd={this.props.updatePwd} />
            </div>
        );
    }
}

EditUser.propTypes = {
    user: PropTypes.object.isRequired,
    updateUser: PropTypes.func.isRequired,
    updatePwd: PropTypes.func.isRequired
};

export default EditUser;
