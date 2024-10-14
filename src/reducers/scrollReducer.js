// reducers.js
const initialState = {
  isScroll: true,
};

const scrollReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'isScroll':
      return {
        ...state,
        isScroll: action.payload,
      };
    default:
      return state;
  }
};

export default scrollReducer;
