import { connect } from 'react-redux';
import ManageUsers from '../components/ManageUsers';
import { getAllUsers, deleteUser, updateUser, updatePwd } from '../actions/user';
import { routeActions } from 'react-router-redux';

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
        updateUser: (userData) => dispatch(updateUser(userData)),
        updatePwd: (newPwd, currentPwd, userId, successCb) => dispatch(updatePwd(newPwd, currentPwd, userId, successCb)),
        addNewUser: () => dispatch(routeActions.push('/admin/manageUsers/addUser'))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
