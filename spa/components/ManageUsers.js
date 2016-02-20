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

    componentWillReceiveProps(nextProps) {
        const {selectedUserRow} = this.state;

        if(selectedUserRow !== null) {
            this.setState({
                selectedUser: nextProps.users[selectedUserRow]
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

            const roles = user.roles.map((role, roleIdx) => {
                const labelClass = role==='admin' ? 'label label-danger' : 'label label-info';
                return <span key={roleIdx} className={labelClass} style={{display: 'inline-block', marginLeft: 3}}>{role}</span>;
            });

            return (
                <tr key={idx} className={activeCss} onClick={() => this.rowClicked(idx)}>
                    <td>{user.userName}</td>
                    <td>{user.realName}</td>
                    <td>{user.email}</td>
                    <td>{roles}</td>
                    <td>{deleteUserBtn}</td>
                </tr>
            );
        });

        const userEditor = this.state.selectedUser ? <EditUser user={this.state.selectedUser} updateUser={this.props.updateUser} updatePwd={(newPwd, currentPwd, successCb) => this.props.updatePwd(newPwd, currentPwd, this.state.selectedUser.id, successCb)} /> : null;
        const updateButton = currentUserIsAdmin ? <button className='btn btn-warning btn-xs' onClick={() => this.props.updateFromServer()}>Update</button> : null;
        const addUserButton = currentUserIsAdmin ? <button className='btn btn-success btn-xs' onClick={() => this.props.addNewUser()} style={{marginLeft: 10}}>Add user</button> : null;

        const hasChildren = this.props.children !== null;
        const content = hasChildren ? this.props.children : (
            <div className='table-responsive'>
                {updateButton}
                {addUserButton}
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
            </div>);

        return (
            <div>
                {content}
            </div>
        );
    }
}

ManageUsers.propTypes = {
    users: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    updateFromServer: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    updatePwd: PropTypes.func.isRequired,
    addNewUser: PropTypes.func.isRequired
};

export default ManageUsers;
