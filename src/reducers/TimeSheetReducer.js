// reducers.js
const initialState = {
  is_TimeSheetModal: null,
};

const timeSheetModalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'Is_Modal':
      return {
        ...state,
        is_TimeSheetModal: action.payload,
      };
    default:
      return state;
  }
};

export default timeSheetModalReducer;
