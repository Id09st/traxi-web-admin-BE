const { conn, sql } = require("../config/dbconfig");
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { format } = require('date-fns');
const { paginate } = require("../helper/paginate")

const getAllReviews = async (currentPage, pageSize, result) => {
    try {
        const pool = await conn;
        const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM Review";
        const totalCountResult = await pool.request().query(totalCountQuery);
        const totalCount = totalCountResult.recordset[0].totalCount;
        const paginationInfo = paginate(totalCount, currentPage, pageSize);

        const sqlString = "SELECT * FROM Review ORDER BY InsDate DESC;";
        const data = await pool.request().query(sqlString);

        const paginatedResult = {
            pagination: paginationInfo,
            data: data.recordset
        };
        result(null, paginatedResult);
    } catch (error) {
        result(error, null);
    }
};

const getReviewsByDay = async function (date, currentPage, pageSize, result) {
    try {
        var pool = await conn;
        const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM Review WHERE CAST(InsDate AS DATE) = @date";
        const totalCountResult = await pool.request()
            .input('date', sql.DateTime, date)
            .query(totalCountQuery);
        const totalCount = totalCountResult.recordset[0].totalCount;
        const paginationInfo = paginate(totalCount, currentPage, pageSize);
        const sqlString = `
            SELECT * FROM (
                SELECT ROW_NUMBER() OVER (ORDER BY InsDate DESC) AS RowNum, * 
                FROM Review 
                WHERE CAST(InsDate AS DATE) = @date
            ) AS ReviewsWithRowNumbers 
            WHERE RowNum > ${paginationInfo.startRow} AND RowNum <= ${paginationInfo.endRow}`;

        await pool.request()
            .input('date', sql.DateTime, date)
            .query(sqlString, function (err, data) {
                console.log("Data", data)
                if (err) {
                    return result(err, null);
                }

                const paginatedResult = {
                    pagination: paginationInfo,
                    data: data.recordset
                };

                result(null, paginatedResult);
            });
    } catch (error) {
        result(error, null);
    }
};



module.exports = {
    getAllReviews,
    getReviewsByDay
}