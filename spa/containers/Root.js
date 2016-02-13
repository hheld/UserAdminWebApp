import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Login from './Login';
import Dashboard from './Dashboard';
import configureStore, {browserHistory} from '../store/configureStore';
import { Router, Route, IndexRoute } from 'react-router';
import {getUserInfo} from '../actions/user';

const store = configureStore();
const history = browserHistory;

// dispatch initial actions
store.dispatch(getUserInfo());

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
                        <IndexRoute component={Dashboard} onEnter={requireAuth(store)} />
                        <Route path='login' component={Login} />
                    </Route>
                </Router>
            </Provider>
        );
    }
}
