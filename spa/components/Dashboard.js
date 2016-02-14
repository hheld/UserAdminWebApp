import React, { Component, PropTypes } from 'react';
import UserInfo from './UserInfo';
import Header from './Header';

class Dashboard extends Component {
    render() {
        const {userName, realName, email, roles} = this.props.userInfo;
        const {logout} = this.props;

        const subComponents = this.props.children;

        const navigationLinks = subComponents ? null :
                <a role='button' onClick={() => this.props.navigateToLink('/admin/manageUsers')}>Manage users</a>
        ;

        return (
            <div className='container'>
                <Header headerText='Dashboard' navigateToLink={this.props.navigateToLink} navPath={this.props.navPath} />
                <UserInfo userName={userName} realName={realName} email={email} logout={logout} roles={roles} />
                {navigationLinks}
                {subComponents}
            </div>
        );
    }
}

Dashboard.propTypes = {
    userInfo: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    navigateToLink: PropTypes.func.isRequired,
    navPath: PropTypes.string.isRequired
};

export default Dashboard;
