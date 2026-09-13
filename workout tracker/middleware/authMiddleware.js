const jwt = require('jsonwebtoken');



module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({message: 'No token, authorization denied'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // add uncoded token dates to req.user
        next(); // move to next middleware
    } catch (err) {
        res.status(401).json({message: 'Token is not valid'});
    }
};