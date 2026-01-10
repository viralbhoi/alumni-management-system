export function requireVerified(req, res, next) {
    if (req.user?.role !== "ALUMNI") {
        return res.status(403).json({ error: "Alumni access required" });
    }

    if (req.user.verification_status !== "VERIFIED") {
        return res.status(403).json({ error: "Alumni not verified" });
    }

    next();
}
