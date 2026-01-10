import pool from "../db.js";

/**
 * POST /api/alumni
 * Register alumni (PENDING)
 */
export async function registerAlumni(req, res) {
    const { roll_no, full_name, graduation_year } = req.body;

    // basic validation
    if (!roll_no || !full_name || !graduation_year) {
        return res.status(400).json({
            error: "roll_no, full_name, graduation_year are required",
        });
    }

    try {
        const result = await pool.query(
            `
      INSERT INTO alumni (roll_no, full_name, graduation_year)
      VALUES ($1, $2, $3)
      RETURNING id, verification_status
      `,
            [roll_no, full_name, graduation_year]
        );

        return res.status(201).json(result.rows[0]);
    } catch (err) {
        // duplicate identity
        if (err.code === "23505") {
            return res.status(409).json({
                error: "Alumni with same roll number and name already exists",
            });
        }

        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * GET /api/alumni/me
 * Get logged-in alumni identity
 */
export async function getMyAlumni(req, res) {
  const alumniId = req.user.alumni_id;

  try {
    const result = await pool.query(
      `
      SELECT id, roll_no, full_name, graduation_year, verification_status
      FROM alumni
      WHERE id = $1
      `,
      [alumniId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


/**
 * PATCH /api/admin/alumni/:id/verification
 * Admin verifies or rejects alumni
 */
export async function verifyAlumni(req, res) {
  const alumniId = req.params.id;
  const { status } = req.body;

  if (!["VERIFIED", "REJECTED"].includes(status)) {
    return res.status(400).json({
      error: "status must be VERIFIED or REJECTED",
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE alumni
      SET verification_status = $1
      WHERE id = $2
      RETURNING id, verification_status
      `,
      [status, alumniId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
