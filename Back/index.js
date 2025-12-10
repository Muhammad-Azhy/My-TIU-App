import express from "express";
import cors from "cors";
// import userRouter from "./Routes/userRoutes.js";
// import todoRouter from "./Routes/Todos/todoRoutes.js";
const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
// app.use(userRouter);
// app.use(todoRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
