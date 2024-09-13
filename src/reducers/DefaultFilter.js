// reducers.js
const initialState = {
  defaultFilterId: null,
};

const defaultFilterIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'defaultFilterId':
      return {
        ...state,
        defaultFilterId: action.payload,
      };
    default:
      return state;
  }
};

export default defaultFilterIdReducer;
