const { getAllReviews,
    getReviewsByDay } = require('../services/report.service');

exports.getReviewList = async (req, res) => {
    try {
        const currentPage = parseInt(req.params.currentPage);
        const pageSize = parseInt(req.params.pageSize);
        getAllReviews(currentPage, pageSize, (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Send the result as a response
                res.json(result);
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getReviewByDate = function (req, res) {
    const date = req.params.date;
    console.log(date);
    getReviewsByDay(date, req.params.currentPage, req.params.pageSize, function (err, data) {
        res.send({ result: data, error: err });
    });
}
