import {SET_AVAILABLE_PLUGINS} from '../actions/plugins';

export default function pluginReducer(state=[], action) {
    switch(action.type) {
    case SET_AVAILABLE_PLUGINS:
        return action.plugins;
    default:
        return state;
    }
}
