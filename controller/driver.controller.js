
const { getAllDrivers,
    getDetail,
    create,
    update,
    banAccount,
    exportList
} = require("../services/driver.service");


exports.getDriverList = async (req, res) => {
    try {
        const results = await getAllDrivers(req.params.currentPage, req.params.pageSize);
        res.status(200).json({ listDrivers: results });
    } catch (error) {
        console.error('Error getting drivers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getDriverById = function (req, res) {
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

exports.updateDriver = function (req, res) {
    const id = req.params.id;
    update(req.body, id, function (err, data) {
        res.send({ result: data, error: err });
    })
}

exports.banDriver = function (req, res) {
    const id = req.params.id;
    banAccount(id, function (err, data) {
        res.send({ result: data, error: err });
    })
}

exports.exportListDriver = async (req, res) => {
    console.log("List Driver: ", req.listDrivers);
    try {
        await exportList(req.listDrivers);
        res.status(200).json({ message: 'CSV file written successfully' });
    } catch (err) {
        console.error('Error writing CSV file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
