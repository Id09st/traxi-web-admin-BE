var { conn, sql } = require('../config/dbconfig')
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
const config = require('../config/config');
var { generateAccessToken, authenticateToken } = require('../auth/auth');
const utils = require('../auth/utils');
const tokenList = {};

function checkRole(role) {
    return function (req, res, next) {
        if (req.user && req.user.roles.includes(role)) {
            return next(); // Cho phép tiếp tục
        } else {
            return res.status(403).json({ error: 'Permission denied' });
        }
    };
}

const loginARToken = async function (req, res) {
    const postData = req.body;
    const user = {
        "name": postData.name,
        "password": postData.password
    }
    var pool = await conn;
    const stringQuery = 'SELECT * FROM Account WHERE name = @name AND password = @password And Status = 1 ';
    const resultQuery = await pool
        .request()
        .input('name', user.name)
        .input('password', user.password)
        .query(stringQuery);
    if (resultQuery.recordset.length > 0) {
        const userSuccess = resultQuery.recordset[0];
        console.log("User Success", userSuccess)
        const token = jwt.sign(userSuccess, config.secret, {
            expiresIn: config.tokenLife,
        });

        const refreshToken = jwt.sign(userSuccess, config.refreshTokenSecret, {
            expiresIn: config.refreshTokenLife
        });
        tokenList[refreshToken] = userSuccess;
        const response = {
            token,
            refreshToken,
        }

        res.json(response);
    } else {
        return res.status(404).json({ message: "Can not find the corresponding user." });
    }
}

const refreshToken = async function (req, res) {
    // User gửi mã Refresh token kèm theo trong body
    const { refreshToken } = req.body;
    console.log("Refresh Token", req.body);
    console.log("Token List", tokenList);
    // Kiểm tra Refresh token có được gửi kèm và mã này có tồn tại trên hệ thống hay không
    if ((refreshToken) && (refreshToken in tokenList)) {

        try {
            // Kiểm tra mã Refresh token
            await utils.verifyJwtToken(refreshToken, config.refreshTokenSecret);

            // Lấy lại thông tin user
            const user = tokenList[refreshToken];

            // Tạo mới mã token và trả lại cho user
            const token = jwt.sign(user, config.secret, {
                expiresIn: config.tokenLife,
            });
            const response = {
                token,
            }
            res.status(200).json(response);
        } catch (err) {
            console.error(err);
            res.status(403).json({
                message: 'Invalid refresh token',
            });
        }
    } else {
        res.status(400).json({
            message: 'Invalid request',
        });
    }
}

const logout = async function (req, res) {
    const { refreshToken } = req.body;

    if (refreshToken && refreshToken in tokenList) {
        delete tokenList[refreshToken];
        res.status(200).json({ message: "Logout successful." });
    } else {
        res.status(400).json({ message: "Invalid refresh token." });
    }
}
module.exports = {
    checkRole,
    loginARToken,
    refreshToken,
    logout
}