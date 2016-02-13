import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import authReducer from './auth';
import userReducer from './user';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    routing: routeReducer
});

export default rootReducer;
