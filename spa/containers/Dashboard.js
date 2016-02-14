import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import { logout } from '../actions/auth';
import { routeActions } from 'react-router-redux';

function mapStateToProps(state) {
    return {
        userInfo: state.user,
        navPath: state.routing.location.pathname
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => { dispatch(logout()); },
        navigateToLink: (link) => { dispatch(routeActions.push(link)); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
