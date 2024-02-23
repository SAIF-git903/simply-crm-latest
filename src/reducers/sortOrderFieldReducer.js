// reducers.js
const initialState = {
  fields: null,
};

const sortOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SORT_FIELDS':
      return {
        ...state,
        fields: action.payload,
      };
    default:
      return state;
  }
};

export default sortOrderReducer;
