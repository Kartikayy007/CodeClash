
import { createSlice } from '@reduxjs/toolkit';
import { set } from 'date-fns';
import JoinedClasses from '../yourClasses/joinedClasses';

const initialState = {
  name: '',
  email: '',
  userId: null,
  noOfJoinedClasses:0,
  noOfCreatedClasses:0,

};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserName: (state, action) => {
      console.log(action.payload)
      state.name = action.payload;

    },
    setUserId(state, action) {
      state.userId = action.payload;
  },
  setUserMail(state, action) {
    state.email = action.payload;
  }
,
  setNoOfJoinedClasses(state, action) {
    state.noOfJoinedClasses = action.payload;
  },
  setNoOfCreatedClasses(state, action) {
    state.noOfCreatedClasses = action.payload;
  },
  },
});

export const { setUserId,setUserName ,setUserMail,setNoOfCreatedClasses,setNoOfJoinedClasses} = userSlice.actions;

export default userSlice.reducer;
