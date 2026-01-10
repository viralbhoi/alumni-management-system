export function mockAuth(req, res, next) {
    req.user = {
        alumni_id: 1,
        role: "ALUMNI",
        verification_status: "VERIFIED", // toggle to test
    };
    next();
}
