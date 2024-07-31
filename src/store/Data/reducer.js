const initialState = {
  id: "",
};

const BookingDetails = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case "GET_DETAILS":
      return {
        ...state,
        id: action.payload,
      };
    default:
      return { ...state };
  }
};

export default BookingDetails;
