import React, { PropTypes } from 'react';
import md5 from 'md5';

class UserInfo extends React.Component {
    render () {
        const {userName, realName, email} = this.props;
        const emailHash = md5(email);
        const gravatarUrl = 'https://secure.gravatar.com/avatar/' + emailHash;

        return (
            <div className='container-fluid well span6'>
                <div className='row-fluid'>
                    <div className='span2' >
                        <img src={gravatarUrl} className='img-circle' />
                    </div>

                    <div className='span8'>
                        <h3>{userName}</h3>
                        <h6>Email: {email}</h6>
                        <h6>Name: {realName}</h6>
                    </div>
                </div>
            </div>
        );
    }
}

UserInfo.propTypes = {
    userName: PropTypes.string.isRequired,
    realName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
};

UserInfo.defaultProps = {
    userName: '',
    realName: '',
    email: ''
};

export default UserInfo;
