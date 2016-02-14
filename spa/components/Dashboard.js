import React, { Component, PropTypes } from 'react';
import UserInfo from './UserInfo';

class Dashboard extends Component {
    render() {
        const {userName, realName, email, roles} = this.props.userInfo;
        const {logout} = this.props;

        return (
            <div>
                <h1>Dashboard</h1>
                <UserInfo userName={userName} realName={realName} email={email} logout={logout} roles={roles} />
            </div>
        );
    }
}

Dashboard.propTypes = {
    userInfo: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
};

export default Dashboard;
