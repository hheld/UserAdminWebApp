import { connect } from 'react-redux';
import ManageUsers from '../components/ManageUsers';

function mapStateToProps(state) {
    return {
        users: ['user1', 'user2']
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ManageUsers);
