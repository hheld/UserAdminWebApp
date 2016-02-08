import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import reducers from '.';

const rootReducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

export default rootReducer;
