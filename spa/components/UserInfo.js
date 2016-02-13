import React, { PropTypes } from 'react';
import md5 from 'md5';

class UserInfo extends React.Component {
    render () {
        const {userName, realName, email} = this.props;
        const emailHash = md5(email);
        const gravatarUrl = 'https://secure.gravatar.com/avatar/' + emailHash;
        const logout = this.props.logout;

        return (
            <div style={{width: 350}} className='pull-right'>
                <div className='container well' style={{display: 'block', maxWidth: 100 + '%'}}>
                    <div className='row-fluid'>
                        <div className='col-md-4'>
                            <img src={gravatarUrl} className='img-circle img-responsive' />
                        </div>

                        <div className='col-md-6'>
                            <h3>{userName}</h3>
                            <h6>Email: {email}</h6>
                            <h6>Name: {realName}</h6>
                        </div>

                        <div className='col-md-1'>
                            <button className='btn btn-primary btn-xs' onClick={logout}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

UserInfo.propTypes = {
    userName: PropTypes.string.isRequired,
    realName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired
};

UserInfo.defaultProps = {
    userName: '',
    realName: '',
    email: ''
};

export default UserInfo;
