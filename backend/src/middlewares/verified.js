export function requireVerified(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.verification_status !== "VERIFIED") {
        return res.status(403).json({ error: "Account not verified" });
    }

    next();
}
