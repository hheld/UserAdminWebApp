import request from 'superagent';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';

export function setCurrentUser(userInfo) {
    return {
        type: SET_CURRENT_USER,
        userInfo: userInfo
    };
}

export function getUserInfo() {
    return (dispatch, getState) => {
        const {isAuthenticated, csrfToken} = getState().auth;

        if(isAuthenticated) {
            request
            .get('/api/userInfo')
            .set('X-Csrf-token', csrfToken)
            .end(function(err, res) {
                if(err || !res.ok) {
                    dispatch(setCurrentUser({}));
                } else {
                    dispatch(setCurrentUser(JSON.parse(res.text)));
                }
            });
        } else {
            dispatch(setCurrentUser({}));
        }
    };
}
