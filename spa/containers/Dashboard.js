import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';
import { logout } from '../actions/auth';

function mapStateToProps(state) {
    return {
        userInfo: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        logout: () => { dispatch(logout()); }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
