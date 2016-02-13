import request from 'superagent';
import {routeActions} from 'react-router-redux';
import {getUserInfo} from './user';

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
                    dispatch(routeActions.push('/login'));
                } else {
                    dispatch({type: AUTH_SUCCESS});
                    dispatch(routeActions.push('/'));
                    dispatch(getUserInfo());
                }
            });
        } else {
            // already authenticated; nothing to do!
        }
    };
}

export function logout() {
    return (dispatch) => {
        dispatch({type: LOGOUT});
        dispatch(routeActions.push('/login'));
    };
}
