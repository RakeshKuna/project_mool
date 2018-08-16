const initialState = {
  privateKeys: [],
};

function mlStartupEditTemplateReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_PRIVATE_KEYS':
      state.privateKeys = action.payload;
      return state;
    default:
      return state;
  }
}

export default mlStartupEditTemplateReducer;
