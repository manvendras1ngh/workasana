import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { instantiateConnection } from "./db/db.connect.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import teamRoutes from "./routes/team.routes.js";
import projectRoutes from "./routes/project.routes.js";

//server config
configDotenv({ path: "./.env" });
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

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
  })
);

//api's
app.get("/", (req, res) => {
  res.json({ message: "Home route" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/projects", projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});

export default app;
