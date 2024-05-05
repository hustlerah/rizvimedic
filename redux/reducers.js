// redux/reducers.js
const initialState = {
    doctorDetails: null,
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_DOCTOR_DETAILS':
        return { ...state, doctorDetails: action.payload };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  