import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import authReducer from './auth';

const rootReducer = combineReducers(Object.assign({}, {
    auth: authReducer
}, {
    routing: routeReducer
}));

export default rootReducer;
