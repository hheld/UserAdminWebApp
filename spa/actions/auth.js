import request from 'superagent';

export const REQUEST_TOKEN = 'REQUEST_TOKEN';

export function requestToken(userLoginInfo) {
  return (dispatch, getState) => {
    const {isAuthenticated} = getState();

    if (!isAuthenticated) {
      request
      .post('/token')
      .send(userLoginInfo)
      .end(function(err, res) {
        if (err || !res.ok) {
          console.log('logged in not successful');
        } else {
          console.log('successfully logged in');
        }
      });
    }
    // dispatch({type: INCREMENT});
  };
}
