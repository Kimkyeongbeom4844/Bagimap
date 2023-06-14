import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  pk: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setUserEmail: (state, action) => {
      state.email = action.payload;
    },
    setPk: (state, action) => {
      state.pk = action.payload;
    },
  },
});

export const { setFirstName, setLastName, setUserEmail, setPk } =
  userSlice.actions;
export default userSlice.reducer;
