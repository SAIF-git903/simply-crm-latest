import { LOGIN_USER_SUCCESS } from '../actions/types';

const INITIAL_STATE = { loginDetails: {} };

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN_USER_SUCCESS:
      return { ...state, loginDetails: action.payload };
    default:
      return state;
  }
};
