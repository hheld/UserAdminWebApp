import { connect } from 'react-redux';
import AddUser from '../components/AddUser';
import { addNewUser } from '../actions/user';

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addNewUser: (newUserInfo) => dispatch(addNewUser(newUserInfo))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
