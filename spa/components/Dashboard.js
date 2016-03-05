import React, { Component, PropTypes } from 'react';
import UserInfo from './UserInfo';
import Header from './Header';

class Dashboard extends Component {
    render() {
        const {userName, realName, email, roles, id} = this.props.userInfo;
        const {logout} = this.props;

        const subComponents = this.props.children;

        const navigationLinks = subComponents ? null :
        <div className='list-group'>
            <a role='button' className='list-group-item' onClick={() => this.props.navigateToLink('/admin/manageUsers')}>Manage users</a>
            <a role='button' className='list-group-item' onClick={() => this.props.navigateToLink('/admin/plugins')}>Plugins</a>
        </div>
        ;

        const userInfo = userName!==undefined && realName!==undefined && email!==undefined && roles!==undefined && id!==undefined ?
        <UserInfo userName={userName} realName={realName} email={email} logout={logout} roles={roles} userId={id} /> :
            null;

        return (
            <div className='container-fluid'>
                <div className='row-fluid'>
                    <div className='col-md-10'>
                        <Header headerText='Dashboard' navigateToLink={this.props.navigateToLink} navPath={this.props.navPath} />
                        {navigationLinks}
                        {subComponents}
                    </div>
                    <div className='col-md-2 pull-right'>
                        {userInfo}
                    </div>
                </div>
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
