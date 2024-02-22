const jwt = require('jsonwebtoken');
const utils = require('../auth/utils');
require('dotenv').config();
const config = require('../config/config');

const secretKey = process.env.ACCESS_TOKEN_SECRET;

const invalidatedTokens = [];

function generateAccessToken(user) {
    return jwt.sign(user, secretKey, { expiresIn: '15m' });
}

function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function logout(req, res) {
    const token = req.header('Authorization');
    if (!token) return res.sendStatus(400);

    // Remove the token from the invalidated tokens list
    const index = invalidatedTokens.indexOf(token);
    if (index !== -1) {
        invalidatedTokens.splice(index, 1);
    }

    res.sendStatus(200); // Successful logout
}

const TokenCheckMiddleware = async (req, res, next) => {
    // Lấy thông tin mã token được đính kèm trong request
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log("Token", token)
    // decode token
    if (token) {
        // Xác thực mã token và kiểm tra thời gian hết hạn của mã
        try {
            const decoded = await utils.verifyJwtToken(token, config.secret);
            console.log("Decoded", decoded)
            // Lưu thông tin giã mã được vào đối tượng req, dùng cho các xử lý ở sau
            req.decoded = decoded;
            next();
        } catch (err) {
            // Giải mã gặp lỗi: Không đúng, hết hạn...
            console.error(err);
            return res.status(401).json({
                message: 'Unauthorized access.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
}

module.exports = {
    generateAccessToken,
    authenticateToken,
    logout,
    TokenCheckMiddleware
};
