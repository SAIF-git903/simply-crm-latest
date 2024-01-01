// reducers.js
const initialState = {
  passedValue: null,
};

const durationreducer = (state = initialState, action) => {
  switch (action.type) {
    case 'PASS_VALUE':
      return {
        ...state,
        passedValue: action.payload,
      };
    default:
      return state;
  }
};

export default durationreducer;
