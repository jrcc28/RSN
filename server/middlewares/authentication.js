const jwt = require('jsonwebtoken')

/**
 * Verify token
 * req: request
 * res: response - return
 * next: continue with the exec of the program
 */
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization'); // from headers
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }

        req.user = decoded.user
        next(); // Inside callback
    });
};

/**
 * Verify admin role
 * req: request
 * res: response - return
 * next: continue with the exec of the program
 */
let verifyAdminRole = (req, res, next) => {
    let user = jwt.decode(req.get('Authorization'));
    if (user.user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Unauthorized'
            }
        });
    }
};

module.exports = {
    verifyToken,
    verifyAdminRole
}