import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Login from './Login';
import Dashboard from './Dashboard';
import ManageUsers from './ManageUsers';
import configureStore, {browserHistory} from '../store/configureStore';
import { Router, Route } from 'react-router';
import { getUserInfo, getAllUsers } from '../actions/user';

const store = configureStore();
const history = browserHistory;

// dispatch initial actions
store.dispatch(getUserInfo());
store.dispatch(getAllUsers());

const requireAuth = (store) => {
    return (nextState, replaceState) => {
        const {isAuthenticated} = store.getState().auth;

        if (!isAuthenticated) {
            replaceState(nextState.location.pathname, '/login');
        }
    };
};

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Route path='/'>
                        <Route path='login' component={Login} />
                        <Route path='admin' component={Dashboard} onEnter={requireAuth(store)}>
                            <Route path= 'manageUsers' component={ManageUsers} />
                        </Route>
                    </Route>
                </Router>
            </Provider>
        );
    }
}
