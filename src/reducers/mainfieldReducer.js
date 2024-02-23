// reducers.js
const initialState = {
  fields: null,
};

const fieldReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PASS_FIELDS':
      return {
        ...state,
        fields: action.payload,
      };
    default:
      return state;
  }
};

export default fieldReducer;
