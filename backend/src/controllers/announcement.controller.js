import pool from "../db.js";

/*
GET /api/announcements
Public announcements with pagination
*/
export async function getAnnouncements(req, res) {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            `
            SELECT id, title, content, created_at, is_pinned
            FROM announcements
            WHERE is_public = TRUE
            ORDER BY is_pinned DESC, created_at DESC
            LIMIT $1 OFFSET $2
            `,
            [limit, offset],
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

/*
GET /api/announcements/:id
*/
export async function getAnnouncement(req, res) {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `
            SELECT id, title, content, created_at, is_pinned
            FROM announcements
            WHERE id = $1
            `,
            [id],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

/*
POST /api/announcements
Admin creates announcement
*/
export async function createAnnouncement(req, res) {
    const { title, content, is_pinned = false, is_public = true } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            error: "title and content are required",
        });
    }

    try {
        const result = await pool.query(
            `
            INSERT INTO announcements
            (title, content, created_by, is_pinned, is_public)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING id
            `,
            [title, content, req.user.id, is_pinned, is_public],
        );

        res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

/*
PATCH /api/announcements/:id
Admin updates announcement
*/
export async function updateAnnouncement(req, res) {
    const { id } = req.params;
    const { title, content, is_pinned, is_public } = req.body;

    try {
        const result = await pool.query(
            `
            UPDATE announcements
            SET
                title = COALESCE($1, title),
                content = COALESCE($2, content),
                is_pinned = COALESCE($3, is_pinned),
                is_public = COALESCE($4, is_public)
            WHERE id = $5
            RETURNING id
            `,
            [title, content, is_pinned, is_public, id],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Announcement not found",
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}

/*
DELETE /api/announcements/:id
Admin deletes announcement
*/
export async function deleteAnnouncement(req, res) {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM announcements WHERE id = $1`,
            [id],
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                error: "Announcement not found",
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
}
