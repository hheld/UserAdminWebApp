import React, { PropTypes } from 'react';
import md5 from 'md5';

class UserInfo extends React.Component {
    render () {
        const {userName, realName, email, roles} = this.props;
        const emailHash = md5(email);
        const gravatarUrl = 'https://secure.gravatar.com/avatar/' + emailHash + '?d=mm';
        const logout = this.props.logout;

        const roleLabels = roles ? roles.map((role, idx) => {
            const labelClass = role === 'admin' ? 'label label-danger' : 'label label-info';
            return (<label key={idx} className={labelClass} style={{display: 'inline-block', marginLeft: 3}}>{role}</label>);
        }) : null;

        return (
            <div className='container-fluid well well-sm'>
                <div className='row-fluid'>
                    <div className='col-md-4'>
                        <img src={gravatarUrl} className='img-circle img-responsive' />
                        <div className='navbar-btn text-center' style={{marginTop: 20}}>
                            <button className='btn btn-primary btn-xs' onClick={logout}>Logout</button>
                        </div>
                    </div>

                    <div className='col-md-8'>
                        <h6>{realName} <small>({userName})</small></h6>
                        <h6><small>{email}</small></h6>
                        {roleLabels}
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
    logout: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    roles: PropTypes.array
};

export default UserInfo;
