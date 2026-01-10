import express from "express";

import { mockAuth } from "./middlewares/auth.js";

import alumniRoutes from "./routes/alumni.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import educationRoutes from "./routes/education.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import mentorshipRoutes from "./routes/mentorship.routes.js";




const app = express();

app.use(express.json());

// health
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Apply auth ONCE for all alumni routes
app.use("/api/alumni", mockAuth);

// Then mount sub-routes
app.use("/api/alumni", alumniRoutes);
app.use("/api/alumni/profile", profileRoutes);
app.use("/api/alumni/experience", experienceRoutes);
app.use("/api/alumni/education", educationRoutes);
app.use("/api/mentorship", mentorshipRoutes);
export default app;
