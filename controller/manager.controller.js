
const { getAll, getDetail, update, create, hiding } = require('../services/manager.service')


exports.getListManager = function (req, res) {
    getAll(req.params.currentPage, req.params.pageSize, function (err, data) {
        res.send({ result: data, error: err });
    })
}

exports.getManagerById = function (req, res) {
    const managerId = req.params.id;
    console.log(managerId);                                                 /////check ID
    getDetail(managerId, function (err, data) {
        res.send({ result: data, error: err });
    });
}

exports.addNew = function (req, res) {
    create(req.body, function (err, data) {
        res.send({ result: data, error: err });

    });
}

exports.updateManager = function (req, res) {
    update(req.body, req.params.id, function (err, data) {
        res.send({ result: data, error: err });
    })
}

exports.deleteManager = function (req, res) {
    hiding(req.params.id, function (err, data) {
        res.send({ result: data, error: err });
    })
}