import {getCsrfToken, deleteCsrfToken} from '../utils/cookieHandling';
import {AUTH_SUCCESS, LOGOUT} from '../actions/auth';

const csrfToken = getCsrfToken();

const initialState = {
  csrfToken: csrfToken,
  isAuthenticated: csrfToken !== null
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      const token = getCsrfToken();
      return {
        csrfToken: token,
        isAuthenticated: token !== null
      };
    case LOGOUT:
      deleteCsrfToken();
      return {
        csrfToken: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
}
