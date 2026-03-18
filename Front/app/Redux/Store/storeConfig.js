import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../Slices/User/userSlice";
import { newsReducer } from "../Slices/News/newsSlice";
import { studentReducer } from "../Slices/Student/studentSlice";
import { themeReducer } from "../Slices/Theme/themeSlice";
export const store = configureStore({
  reducer: {
    news: newsReducer,
    student: studentReducer,
    user: userReducer,
    theme: themeReducer,
  },
});
