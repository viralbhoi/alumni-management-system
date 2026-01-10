import app from "./app.js";
import pool from "./db.js";

const PORT = process.env.PORT || 3000;

app.get("/db-health", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ db: "connected" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ db: "error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
