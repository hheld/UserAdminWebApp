import {SET_AVAILABLE_PLUGINS, SET_PLUGIN_PAGE} from '../actions/plugins';

const initialState = {
    pluginNames: [],
    pluginPages: {}
};

export default function pluginReducer(state=initialState, action) {
    switch(action.type) {
    case SET_AVAILABLE_PLUGINS:
        return Object.assign({}, state, {
            pluginNames: action.plugins.plugins
        });
    case SET_PLUGIN_PAGE:
        const pageObj = {};
        pageObj[action.pluginName] = action.pluginPage;

        return Object.assign({}, state, Object.assign({}, {pluginPages: pageObj}));
    default:
        return state;
    }
}
