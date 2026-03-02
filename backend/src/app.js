import cors from "cors";
import express from "express";

import { authenticate } from "./middlewares/auth.middleware.js";

import alumniRoutes from "./routes/alumni.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import educationRoutes from "./routes/education.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import mentorshipRoutes from "./routes/mentorship.routes.js";
import publicRoutes from "./routes/public.routes.js";
import authRoutes from "./routes/auth.routes.js";
import announcementRoutes from "./routes/announcement.routes.js";

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
    }),
);

app.use(express.json());

// health
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Apply auth ONCE for all alumni routes
app.use("/api/auth", authRoutes);

// Then mount sub-routes
app.use("/api/alumni", authenticate, alumniRoutes);
app.use("/api/alumni/profile", authenticate, profileRoutes);
app.use("/api/alumni/experience", authenticate, experienceRoutes);
app.use("/api/alumni/education", authenticate, educationRoutes);
app.use("/api/mentorship", authenticate, mentorshipRoutes);
app.use("/api/public", authenticate, publicRoutes);
app.use("/api/admin", authenticate, adminRoutes);
app.use("/api/announcements", authenticate, announcementRoutes);

export default app;
