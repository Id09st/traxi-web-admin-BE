const { getListTransaction } = require("../services/transaction.service")

exports.getTransaction = async (req, res) => {
    try {
        const currentPage = parseInt(req.params.currentPage);
        const pageSize = parseInt(req.params.pageSize);
        getListTransaction(currentPage, pageSize, (error, result) => {
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