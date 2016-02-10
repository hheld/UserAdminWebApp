import { connect } from 'react-redux';
import Login from '../components/Login';
import { bindActionCreators } from 'redux';
import * as AuthActions from '../actions/auth';

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
