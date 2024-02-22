const { loginToken, loginARToken } = require('../services/auth.service');

exports.Login = function (req, res) {
    const name = req.body.name;
    const password = req.body.password;

    loginToken(name, password, function (err, data) {
        if (err) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.json({ result: data });
        }
    });
}

exports.LoginToken = function (req, res) {
    loginARToken(req, function (err, data) {
        if (err) {
            res.status(err.status).json({ message: err.message });
        } else {
            res.json({ result: data });
        }
    });
}
