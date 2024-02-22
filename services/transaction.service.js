const { conn, sql } = require("../config/dbconfig");
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { format } = require('date-fns');
const { paginate } = require("../helper/paginate")

const getListTransaction = async (currentPage, pageSize, result) => {
    try {
        const pool = await conn;
        const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM [Transaction]";
        const totalCountResult = await pool.request().query(totalCountQuery);
        const totalCount = totalCountResult.recordset[0].totalCount;
        const paginationInfo = paginate(totalCount, currentPage, pageSize);
        const sqlString = "SELECT * FROM [Transaction];"
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

module.exports = {
    getListTransaction
}