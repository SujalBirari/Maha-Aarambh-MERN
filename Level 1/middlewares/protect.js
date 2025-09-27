const jwt = require('jsonwebtoken')
const User = require('../models/userModel');

async function protect(req, res, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, "accesssecretkey");

            const currentUser = await User.findById(decoded.id).select('-password');
            if (!currentUser) {
                return res.status(401).json({
                    message: 'The user belonging to this token no longer exists'
                });
            }

            req.user = currentUser;

            next();
        }
        catch (err) {
            return res.status(401).json({
                message: 'Not authorized, token failed.'
            });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token.' });
    }
}

module.exports = protect;