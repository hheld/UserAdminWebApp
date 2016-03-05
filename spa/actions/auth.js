import request from 'superagent';
import { routeActions } from 'react-router-redux';
import { getUserInfo, getAllUsers } from './user';
import { getPluginPage } from './plugins';

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const LOGOUT = 'LOGOUT';

export function requestToken(userLoginInfo) {
    return (dispatch, getState) => {
        const {isAuthenticated} = getState().auth;
        let action = getState().routing.location.action;

        if(!action.startsWith('/')) {
            action = getState().routing.location.pathname;
        }

        if (!isAuthenticated) {
            request
            .post('/token')
            .send(userLoginInfo)
            .end(function(err, res) {
                if (err || !res.ok) {
                    dispatch(routeActions.push('/login'));
                } else {
                    dispatch({type: AUTH_SUCCESS});
                    dispatch(routeActions.push(action));
                    dispatch(getUserInfo());
                    dispatch(getAllUsers());

                    getState().plugins.pluginNames.forEach((plugin) => {
                        dispatch(getPluginPage(plugin));
                    });
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

        request
        .get('/logout')
        .end();

        dispatch(routeActions.push('/login'));
    };
}
