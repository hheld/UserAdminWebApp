import React, { Component, PropTypes } from 'react';
import UserInfo from './UserInfo';

class Dashboard extends Component {
    render() {
        const {userName, realName, email} = this.props.userInfo;

        return (
            <div>
                <h1>Dashboard</h1>
                <UserInfo userName={userName} realName={realName} email={email} />
            </div>
        );
    }
}

Dashboard.propTypes = {
    userInfo: PropTypes.object.isRequired
};

export default Dashboard;
