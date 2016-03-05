import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux';
import authReducer from './auth';
import userReducer from './user';
import pluginReducer from './plugins';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    plugins: pluginReducer,
    routing: routeReducer
});

export default rootReducer;
