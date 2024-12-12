const jwt = require('jsonwebtoken');
const UserModel = require('../db/user.model');

module.exports = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findUserById(decoded.userId);
        if (user) {
            req.user = {
                _id: user._id,
                username: user.username,
                name: user.name
            };
        }
    } catch (error) {
        console.error('Token verification error:', error);
    }

    next();
};