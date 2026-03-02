import pool from "../db.js";

/**
 * POST /api/mentorship/requests
 */
export async function createRequest(req, res) {
    const requesterId = req.user.alumni_id;
    const { mentor_id, message } = req.body;

    if (!mentor_id) {
        return res.status(400).json({ error: "mentor_id is required" });
    }

    if (mentor_id === requesterId) {
        return res.status(400).json({ error: "Cannot request yourself" });
    }

    try {
        // 🔎 Check mentor validity
        const mentorCheck = await pool.query(
            `
            SELECT id
            FROM alumni
            WHERE id = $1
              AND role = 'ALUMNI'
              AND verification_status = 'VERIFIED'
            `,
            [mentor_id],
        );

        if (mentorCheck.rowCount === 0) {
            return res.status(400).json({
                error: "Mentor not found or not eligible",
            });
        }

        const result = await pool.query(
            `
            INSERT INTO mentorship_requests (requester_id, mentor_id, message)
            VALUES ($1, $2, $3)
            RETURNING id
            `,
            [requesterId, mentor_id, message ?? null],
        );

        return res.status(201).json({ id: result.rows[0].id });
    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ error: "Request already exists" });
        }

        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * GET incoming requests
 */
export async function incomingRequests(req, res) {
    const alumniId = req.user.alumni_id;

    const result = await pool.query(
        `
        SELECT r.id,
               a.full_name AS requester_name,
               r.message,
               r.status
        FROM mentorship_requests r
        JOIN alumni a ON a.id = r.requester_id
        WHERE r.mentor_id = $1
          AND a.role = 'ALUMNI'
          AND a.verification_status = 'VERIFIED'
        ORDER BY r.created_at DESC
        `,
        [alumniId],
    );

    res.json(result.rows);
}

/**
 * GET outgoing requests
 */
export async function outgoingRequests(req, res) {
    const alumniId = req.user.alumni_id;

    const result = await pool.query(
        `
        SELECT r.id,
               a.full_name AS mentor_name,
               r.status
        FROM mentorship_requests r
        JOIN alumni a ON a.id = r.mentor_id
        WHERE r.requester_id = $1
          AND a.role = 'ALUMNI'
          AND a.verification_status = 'VERIFIED'
        ORDER BY r.created_at DESC
        `,
        [alumniId],
    );

    res.json(result.rows);
}

/**
 * PATCH accept/reject
 */
export async function updateRequest(req, res) {
    const alumniId = req.user.alumni_id;
    const requestId = req.params.id;
    const { status } = req.body;

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
    }

    const result = await pool.query(
        `
    UPDATE mentorship_requests
    SET status = $1, updated_at = now()
    WHERE id = $2 AND mentor_id = $3
    `,
        [status, requestId, alumniId],
    );

    if (result.rowCount === 0) {
        return res.status(404).json({ error: "Request not found" });
    }

    res.json({ success: true });
}
