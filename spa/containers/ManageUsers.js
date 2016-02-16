import { connect } from 'react-redux';
import ManageUsers from '../components/ManageUsers';
import { getAllUsers, deleteUser, updateUser } from '../actions/user';

function mapStateToProps(state) {
    return {
        users: state.user.availableUsers,
        currentUser: state.user.currentUser
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFromServer: () => dispatch(getAllUsers()),
        deleteUser: (userId) => dispatch(deleteUser(userId)),
        updateUser: (userData) => dispatch(updateUser(userData))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
