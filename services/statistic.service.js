const { conn, sql } = require("../config/dbconfig");
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { format } = require('date-fns');

const getTotalDriver = async function (result) {
    var pool = await conn;
    var sqlString = "  SELECT COUNT(Id) FROM DRIVER;";

    return await pool.request()
        .query(sqlString, function (err, data) {
            console.log("Data", data)
            if (data.recordset.length > 0) {
                if (data.recordset.length > 0) {
                    result(null, data.recordset[0]);
                } else {
                    result(null);
                }
            }
        })
}

const getTotalReview = async function (result) {
    var pool = await conn;
    var sqlString = "SELECT COUNT(Id) FROM Review";

    return await pool.request()
        .query(sqlString, function (err, data) {
            console.log("Data", data)
            if (data.recordset.length > 0) {
                if (data.recordset.length > 0) {
                    result(null, data.recordset[0]);
                } else {
                    result(null);
                }
            }
        })
}

const getTotalIncomeDriver = async function (result) {
    var pool = await conn;
    var sqlString = "SELECT SUM(Amount) AS TotalAmount FROM[Transaction] WHERE Action = 'Thanh toán';";
    return await pool.request()
        .query(sqlString, function (err, data) {
            console.log("Data", data)
            if (data.recordset.length > 0) {
                if (data.recordset.length > 0) {
                    result(null, data.recordset[0]);
                } else {
                    result(null);
                }
            }
        })
}

const getTotalTrip = async function (time, result) {
    try {
        var pool = await conn;
        var currentTime = 0;
        var sqlString = "";

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        if (time == "year") {
            currentTime = currentYear;
            sqlString = `
            SELECT COUNT(Id) AS TotalTrip
            FROM [dbo].[Trip]
            WHERE YEAR(BookingDate) = @time;`;
        } else {
            currentTime = currentMonth;
            sqlString = `
            SELECT COUNT(Id) AS TotalTrip
            FROM [dbo].[Trip]
            WHERE MONTH(BookingDate) = @time;`;
        }

        const data = await pool.request()
            .input('time', sql.Int, currentTime)
            .query(sqlString);
        console.log("Data", data);
        if (data.recordset.length > 0) {
            result(null, data.recordset[0]);
        } else {
            result(null);
        }
    } catch (err) {
        console.error("Error:", err);
        result(err);
    }
}




module.exports = {
    getTotalDriver,
    getTotalReview,
    getTotalIncomeDriver,
    getTotalTrip
}