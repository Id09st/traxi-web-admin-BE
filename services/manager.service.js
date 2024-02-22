var { conn, sql } = require('../config/dbconfig')
const { v4: uuidv4 } = require('uuid');
const { paginate } = require("../helper/paginate")

const getAll = async function (currentPage, pageSize, result) {
    try {
        const pool = await conn;

        // Count total records
        const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM Account WHERE Role = 'manager'";
        const totalCountResult = await pool.request().query(totalCountQuery);
        const totalCount = totalCountResult.recordset[0].totalCount;

        // Use the paginate function to get pagination information
        const paginationInfo = paginate(totalCount, currentPage, pageSize);

        // Retrieve paginated data
        const sqlString = `SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum, * FROM Account WHERE Role = 'manager') AS AccountsWithRowNumbers WHERE RowNum > ${paginationInfo.startRow} AND RowNum <= ${paginationInfo.endRow}`;

        await pool.request().query(sqlString, function (err, data) {
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
        console.error("Error:", error);
        result(error, null);
    }
};

const getDetail = async function (id, result) {
    var pool = await conn;
    var sqlString = "select * from Account where Id = @id ";
    return await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query(sqlString, function (err, data) {
            // console.log("Id", id)
            console.log("Data", data)
            if (data != null && data.recordset.length > 0) {
                result(null, data.recordset[0]);
            } else {
                result(null);
            }
        })
}


const create = async function (newData, result) {
    var pool = await conn;
    // Tạo một GUID mới
    const newGuid = uuidv4();
    console.log("original newData", newData);
    const structuredData = {
        Name: newData.name,
        Password: newData.password
    };
    console.log("structured newData", structuredData);
    var sqlString = "INSERT INTO Account(Id, Name, Password, Role, Status)" +
        " VALUES(@newGuid, @name, @password, 'manager', 1)";
    return await pool.request()
        .input('newGuid', sql.UniqueIdentifier, newGuid)
        .input('name', sql.NVarChar, structuredData.Name)
        .input('password', sql.NVarChar, structuredData.Password)
        .query(sqlString, function (err, data) {
            if (err) {
                result(true, null);
            } else {
                result(null, structuredData);
                console.log("newData after query", structuredData);
            }
        });
}

const getUserById = async (id) => {
    var pool = await conn;
    var pool = await conn;
    var sqlString = "select * from Account where Id = @id ";
    return await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query(sqlString, function (err, data) {
            if (data != null && data.recordset.length > 0) {
                return result(null, data.recordset);
            } else {
                return result(null);
            }
        })
}

const update = async function (newData, id, result) {
    var pool = await conn;
    var sqlString = "UPDATE Account " +
        "SET Name = @name, Password = @password " +
        "WHERE Id = @id";
    return await pool.request()
        .input('name', sql.NVarChar, newData.name)
        .input('password', sql.NVarChar, newData.password)
        .input('id', sql.UniqueIdentifier, id)
        .query(sqlString, async function (err, data) {
            if (err) {
                console.error("Error updating record:", err);
                result(true, null);
            } else {
                if (data.rowsAffected[0] > 0) {
                    // Nếu có bản ghi được cập nhật, truy vấn lại dữ liệu từ cơ sở dữ liệu
                    const updatedData = await getUpdatedData(id);
                    result(null, updatedData);
                } else {
                    result("No records updated.", null);
                }
            }
        });
}

async function getUpdatedData(id) {
    var pool = await conn;
    var sqlString = "SELECT * FROM Account WHERE Id = @id";
    const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query(sqlString);
    return result.recordset;
}



const hiding = async function (id, result) {
    var pool = await conn;
    var sqlString =
        "UPDATE Account " +
        "SET Status = 0 " +
        "WHERE Id = @id ";
    // var managerOld = getUserById(id);
    // console.log("DataUpdate", managerOld);
    return await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query(sqlString, function (err, data) {
            if (err) {
                console.error("Error updating record:", err);
                result(true, null);
            } else {
                console.log("Rows affected:", data.rowsAffected);
                console.log("Data", data);
                result(null, data);
            }
        });
}

module.exports = {
    getAll,
    getDetail,
    create,
    update,
    hiding
}