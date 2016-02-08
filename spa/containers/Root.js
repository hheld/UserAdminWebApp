import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Login from './Login';
import configureStore from '../store/configureStore';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';

const store = configureStore();
const history = createBrowserHistory();

export default class Root extends Component {
    render() {
      return (
          <Provider store={store}>
                              <Router history={history}>
                                  <Route path='/'>
                                      <Route path='/login' component={Login} />
                                  </Route>
                              </Router>
                      </Provider>
      );
    }
}
