import { createSlice, nanoid } from "@reduxjs/toolkit";

const seedNews = [
  {
    id: "seed-1",
    title: "Campus WiFi maintenance",
    content: "Short disruption Sunday 2–4 AM. Plan offline work accordingly.",
    departmentLabel: "Global",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    title: "CMPE lab hours",
    content: "Lab 3 extended hours during finals week.",
    departmentLabel: "CMPE",
    updatedAt: new Date().toISOString(),
  },
];

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    managedNews: seedNews,
  },
  reducers: {
    addManagedNews: (state, action) => {
      const { title, content, departmentLabel } = action.payload;
      state.managedNews.unshift({
        id: nanoid(),
        title: title.trim(),
        content: content.trim(),
        departmentLabel: departmentLabel?.trim() || "Global",
        updatedAt: new Date().toISOString(),
      });
    },
    updateManagedNews: (state, action) => {
      const { id, title, content, departmentLabel } = action.payload;
      const item = state.managedNews.find((n) => n.id === id);
      if (item) {
        item.title = title.trim();
        item.content = content.trim();
        item.departmentLabel = departmentLabel?.trim() || "Global";
        item.updatedAt = new Date().toISOString();
      }
    },
    removeManagedNews: (state, action) => {
      state.managedNews = state.managedNews.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const { addManagedNews, updateManagedNews, removeManagedNews } =
  adminSlice.actions;
export const adminReducer = adminSlice.reducer;
