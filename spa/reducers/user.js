import {SET_CURRENT_USER} from '../actions/user';

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
        return action.userInfo;
        default:
        return state;
    }
}
