import React, { PropTypes } from 'react';

class ManageUsers extends React.Component {
    render () {
        return (
            <div>
                {this.props.users}
            </div>
        );
    }
}

ManageUsers.propTypes = {
    users: PropTypes.array.isRequired
};

export default ManageUsers;
