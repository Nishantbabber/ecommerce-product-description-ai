const adminAuth = (req, res, next) => {
    console.log('User role:', req.user.role); // Log user role for debugging
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

module.exports = adminAuth;
