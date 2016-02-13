import { connect } from 'react-redux';
import Dashboard from '../components/Dashboard';

function mapStateToProps(state) {
    return {
        userInfo: state.user
    };
}

export default connect(mapStateToProps)(Dashboard);
