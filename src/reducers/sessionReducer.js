// reducers.js
const initialState = {
  isSession: false,
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'isSession':
      return {
        ...state,
        isSession: action.payload,
      };
    default:
      return state;
  }
};

export default sessionReducer;
