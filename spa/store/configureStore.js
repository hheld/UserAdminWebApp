import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { syncHistory } from 'react-router-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';

const reduxRouterMiddleware = syncHistory(createBrowserHistory());

const createStoreWithMiddleware = applyMiddleware(
    thunk,
    reduxRouterMiddleware
)(createStore);

export default function configureStore(initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
