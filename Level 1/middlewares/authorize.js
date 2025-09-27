function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user) return res.sendStatus(401);

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Access denied: insufficient permissions'
            })
        }

        next();
    }
}