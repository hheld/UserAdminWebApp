import request from 'superagent';

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const LOGOUT = 'LOGOUT';

export function requestToken(userLoginInfo) {
  return (dispatch, getState) => {
    const {isAuthenticated} = getState().auth;

    if (!isAuthenticated) {
      request
      .post('/token')
      .send(userLoginInfo)
      .end(function(err, res) {
        if (err || !res.ok) {
          console.log('logged in not successful');
        } else {
          console.log('successfully logged in');
          dispatch({type: AUTH_SUCCESS});
        }
      });
    } else {
      console.log('already authenticated');
    }
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}
