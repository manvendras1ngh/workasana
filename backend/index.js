import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { instantiateConnection } from "./db/db.connect.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import teamRoutes from "./routes/team.routes.js";
import projectRoutes from "./routes/project.routes.js";
import userRoutes from "./routes/user.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import reportRoutes from "./routes/report.routes.js";

//server config
configDotenv({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

//db connection
try {
  instantiateConnection();
} catch (error) {
  throw error;
}

//server settings
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

//api's
app.get("/", (req, res) => {
  res.json({ message: "Home route" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tags", tagRoutes);
app.use("/api/v1/report", reportRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});

export default app;
