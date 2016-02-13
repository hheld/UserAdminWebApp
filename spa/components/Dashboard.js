import React, { Component, PropTypes } from 'react';
import md5 from 'md5';

class Dashboard extends Component {
    render() {
        const {userName, realName, email} = this.props.userInfo;
        const emailHash = md5(email);
        const gravatarUrl = 'https://secure.gravatar.com/avatar/' + emailHash;

        return (
            <div>
                <h1>Dashboard</h1>
                <p>Welcome {realName} ({userName})</p>
                <img src={gravatarUrl} />
            </div>
        );
    }
}

Dashboard.propTypes = {
    userInfo: PropTypes.object.isRequired
};

export default Dashboard;
