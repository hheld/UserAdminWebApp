import request from 'superagent';

export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const SET_AVAILABLE_USERS = 'SET_AVAILABLE_USERS';

export function setCurrentUser(userInfo) {
    return {
        type: SET_CURRENT_USER,
        userInfo: userInfo
    };
}

export function setAvailableUsers(users) {
    return {
        type: SET_AVAILABLE_USERS,
        users: users
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

export function getAllUsers() {
    return (dispatch, getState) => {
        const {isAuthenticated, csrfToken} = getState().auth;

        if(isAuthenticated) {
            request
            .get('/api/allUsers')
            .set('X-Csrf-token', csrfToken)
            .end(function(err, res) {
                if(err || !res.ok) {
                    dispatch(setAvailableUsers([]));
                } else {
                    dispatch(setAvailableUsers(JSON.parse(res.text)));
                }
            });
        } else {
            dispatch(setAvailableUsers([]));
        }
    };
}

export function deleteUser(userId) {
    return (dispatch, getState) => {
        const {isAuthenticated, csrfToken} = getState().auth;

        if(isAuthenticated) {
            request
            .post('/api/deleteUser')
            .set('X-Csrf-token', csrfToken)
            .send({userId})
            .end(function(err, res) {
                if(!err && res.ok) {
                    dispatch(getAllUsers());
                }
            });
        }
    };
}

export function updateUser(userData) {
    return (dispatch, getState) => {
        const {isAuthenticated, csrfToken} = getState().auth;

        if(isAuthenticated) {
            request
            .post('/api/updateUser')
            .set('X-Csrf-token', csrfToken)
            .send(userData)
            .end(function(err, res) {
                if(!err && res.ok) {
                    dispatch(getAllUsers());
                    dispatch(getUserInfo());
                }
            });
        }
    };
}

export function updatePwd(newPwd, currentPwd, userId) {
    return (dispatch, getState) => {
        const {isAuthenticated, csrfToken} = getState().auth;

        if(isAuthenticated) {
            request
            .post('/api/updatePwd')
            .set('X-Csrf-token', csrfToken)
            .send({
                userId: userId,
                newPwd: newPwd,
                currentPwd: currentPwd
            })
            .end();
        }
    };
}
