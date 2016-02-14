import { SET_CURRENT_USER, SET_AVAILABLE_USERS } from '../actions/user';

const initialState = {
    currentUser: {},
    availableUsers: []
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
        return Object.assign({}, state, {
            currentUser: action.userInfo
        });
        case SET_AVAILABLE_USERS:
        return Object.assign({}, state, {
            availableUsers: action.users
        });
        default:
        return state;
    }
}
