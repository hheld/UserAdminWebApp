import React, { PropTypes } from 'react';
import EditUser from './EditUser';

class ManageUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedUserRow: null,
            selectedUser: null
        };
    }

    rowClicked(rowIdx) {
        if(this.state.selectedUserRow===rowIdx) {
            this.setState({
                selectedUserRow: null,
                selectedUser: null
            });
        } else {
            this.setState({
                selectedUserRow: rowIdx,
                selectedUser: this.props.users[rowIdx]
            });
        }
    }

    render () {
        const {users, currentUser} = this.props;
        const currentUserIsAdmin = currentUser.roles ? currentUser.roles.indexOf('admin')!==-1 : null;

        const userRows = users.map((user, idx) => {
            const isActive = this.state.selectedUserRow===idx;
            const activeCss = isActive ? 'active' : null;

            const deleteUserBtn = currentUserIsAdmin ? <button className='btn btn-danger btn-xs' onClick={() => this.props.deleteUser(user.id)}>Delete</button> : null;

            return (
                <tr key={idx} className={activeCss} onClick={() => this.rowClicked(idx)}>
                    <td>{user.userName}</td>
                    <td>{user.realName}</td>
                    <td>{user.email}</td>
                    <td>{user.roles}</td>
                    <td>{deleteUserBtn}</td>
                </tr>
            );
        });

        const userEditor = this.state.selectedUser ? <EditUser user={this.state.selectedUser} /> : null;

        return (
            <div className='table-responsive'>
                <button className='btn btn-warning btn-xs' onClick={() => this.props.updateFromServer()}>Update</button>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>User name</th>
                            <th>Real name</th>
                            <th>Email</th>
                            <th>Roles</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userRows}
                    </tbody>
                </table>
                {userEditor}
            </div>
        );
    }
}

ManageUsers.propTypes = {
    users: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    updateFromServer: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired
};

export default ManageUsers;
