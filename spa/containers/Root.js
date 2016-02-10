import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Login from './Login';
import Dashboard from './Dashboard';
import configureStore from '../store/configureStore';
import { Router, Route, IndexRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { getCsrfToken, deleteCsrfToken } from '../utils/cookieHandling';

const store = configureStore();
const history = createBrowserHistory();

const requireAuth = (store) => {
  return (nextState, replaceState) => {
    const {isAuthenticated} = store.getState();

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
