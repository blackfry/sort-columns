const familyReducer = (state = { data: [] }, action) => {
  switch (action.type) {
  case 'LOAD_FAMILY_DATA':
    return {
      ...state,
      data: action.payload
    };

  default:
    return state;
  }
};

export default familyReducer;
