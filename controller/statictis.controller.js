const { getTotalDriver,
    getTotalReview,
    getTotalIncomeDriver,
    getTotalTrip } = require("../services/statistic.service");

exports.getTotalDriver = function (req, res) {
    getTotalDriver(function (err, data) {
        const totalDriver = data[""];
        res.send({ result: { totalDriver }, error: err });
    })
}

exports.getTotalReview = function (req, res) {
    getTotalReview(function (err, data) {
        const totalReview = data[""];
        res.send({ result: { totalReview }, error: err });
    })
}

exports.getTotalIncomeDriver = function (req, res) {
    getTotalIncomeDriver(function (err, data) {
        const totalIncomeDriver = data["TotalAmount"];
        res.send({ result: { totalIncomeDriver }, error: err });
    })
}

exports.getTotalTrip = function (req, res) {
    var time = req.params;
    getTotalTrip(time, function (err, data) {
        const totalTrip = data ? data["TotalTrip"] : undefined; // Accessing the TotalTrip property correctly
        res.send({ result: { totalTrip }, error: err });
    })
}