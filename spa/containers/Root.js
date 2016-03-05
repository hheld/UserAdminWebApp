import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Login from './Login';
import Dashboard from './Dashboard';
import ManageUsers from './ManageUsers';
import AddUser from './AddUser';
import Plugins from './Plugins';

import configureStore, {browserHistory} from '../store/configureStore';
import { Router, Route } from 'react-router';
import { getUserInfo } from '../actions/user';
import { getAvailablePlugins } from '../actions/plugins';
import { getPluginPage } from '../actions/plugins';

const store = configureStore();
const history = browserHistory;

// dispatch initial actions
const userInfoPromise = store.dispatch(getUserInfo()).catch(() => {});
const pluginsPromise = store.dispatch(getAvailablePlugins()).catch(() => {})
.then(() => {
    const pluginNames = store.getState().plugins.pluginNames;

    pluginNames.forEach((plugin) => {
        store.dispatch(getPluginPage(plugin));
    });
});

const requireAuth = (store) => {
    return (nextState, replaceState) => {
        const {isAuthenticated} = store.getState().auth;

        if (!isAuthenticated) {
            replaceState(nextState.location.pathname, '/login');
        }
    };
};

const addUserComp = (props) => {
    const {roles} = store.getState().user.currentUser;
    return roles.indexOf('admin')!==-1 ? <AddUser {...props} /> : <div />;
};

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Route path='/'>
                        <Route path='login' component={Login} />
                        <Route path='admin' component={Dashboard} onEnter={requireAuth(store)}>
                            <Route path='manageUsers' component={ManageUsers}>
                                <Route path='addUser' getComponent={(loc, cb) => {
                                    userInfoPromise.then(() => {
                                        cb(null, addUserComp);
                                    });
                                }} />
                            </Route>
                            <Route path='plugins' getComponent={(loc, cb) => {
                                pluginsPromise.then(() => {
                                    cb(null, Plugins);
                                });
                            }} />
                        </Route>
                    </Route>
                </Router>
            </Provider>
        );
    }
}
