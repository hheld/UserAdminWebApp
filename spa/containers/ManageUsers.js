import { connect } from 'react-redux';
import ManageUsers from '../components/ManageUsers';
import { getAllUsers, deleteUser } from '../actions/user';

function mapStateToProps(state) {
    return {
        users: state.user.availableUsers,
        currentUser: state.user.currentUser
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFromServer: () => dispatch(getAllUsers()),
        deleteUser: (userId) => dispatch(deleteUser(userId))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
