import { connect } from 'react-redux';
import ManageUsers from '../components/ManageUsers';
import { getAllUsers } from '../actions/user';

function mapStateToProps(state) {
    return {
        users: state.user.availableUsers
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFromServer: () => dispatch(getAllUsers())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
