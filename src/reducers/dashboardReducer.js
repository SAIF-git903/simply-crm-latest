import {MODULE_SELECT} from '../actions/types';

const INITIAL_STATE = {
  moduleName: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MODULE_SELECT:
      return {...state, moduleName: action.payload};
    default:
      return state;
  }
};
