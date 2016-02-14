import React, { PropTypes } from 'react';

class ManageUsers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedUserRow: null
        };
    }

    rowClicked(rowIdx) {
        if(this.state.selectedUserRow===rowIdx) {
            this.setState({
                selectedUserRow: null
            });
        } else {
            this.setState({
                selectedUserRow: rowIdx
            });
        }
    }

    render () {
        const {users} = this.props;
        const userRows = users.map((user, idx) => {
            const isActive = this.state.selectedUserRow===idx;
            const activeCss = isActive ? 'active' : null;

            return (
                <tr key={idx} className={activeCss} onClick={() => this.rowClicked(idx)}>
                    <td>{user.userName}</td>
                    <td>{user.realName}</td>
                    <td>{user.email}</td>
                    <td>{user.roles}</td>
                </tr>
            );
        });

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
                        </tr>
                    </thead>
                    <tbody>
                        {userRows}
                    </tbody>
                </table>
            </div>
        );
    }
}

ManageUsers.propTypes = {
    users: PropTypes.array.isRequired,
    updateFromServer: PropTypes.func.isRequired
};

export default ManageUsers;
