import { connect } from 'react-redux';
import ManageUsers from '../components/ManageUsers';

function mapStateToProps(state) {
    return {
        users: state.user.availableUsers
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
