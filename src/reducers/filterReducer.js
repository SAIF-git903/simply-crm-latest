// reducers.js
const initialState = {
  filter_id: null,
};

const filterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PASS_FILTER':
      return {
        ...state,
        filter_id: action.payload,
      };
    default:
      return state;
  }
};

export default filterReducer;
