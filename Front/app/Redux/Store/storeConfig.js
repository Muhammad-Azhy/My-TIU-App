import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../Slices/User/userSlice";
import { newsReducer } from "../Slices/News/newsSlice";
import { studentReducer } from "../Slices/Student/studentSlice";
export const store = configureStore({
  reducer: {
    news: newsReducer,
    student: studentReducer,
    user: userReducer,
  },
});
