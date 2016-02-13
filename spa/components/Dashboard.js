import React, { Component, PropTypes } from 'react';

class Dashboard extends Component {
    render() {
        const {userName, realName} = this.props.userInfo;
        return (
            <div>
                <h1>Dashboard</h1>
                <p>Welcome {realName} ({userName})</p>
            </div>
        );
    }
}

Dashboard.propTypes = {
    userInfo: PropTypes.object.isRequired
};

export default Dashboard;
