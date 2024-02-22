const { conn, sql } = require("../config/dbconfig");
const { v4: uuidv4, validate: isValidUUID } = require('uuid');
const { format } = require('date-fns');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { paginate } = require("../helper/paginate")

const getAllDrivers = async (currentPage, pageSize) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra nếu người dùng có vai trò 'manager'
            // if (!userRoles.includes('manager')) {
            //     return reject({ message: 'Permission denied' });
            // }

            const pool = await conn;
            console.log("Connection", conn)
            const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM Driver";
            const totalCountResult = await pool.request().query(totalCountQuery);
            const totalCount = totalCountResult.recordset[0].totalCount;
            const paginationInfo = paginate(totalCount, currentPage, pageSize);
            const sqlString = `SELECT * FROM (SELECT ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS RowNum, * FROM Driver) AS DriversWithRowNumbers WHERE RowNum > ${paginationInfo.startRow} AND RowNum <= ${paginationInfo.startRow + pageSize}`;
            await pool.request().query(sqlString, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const result = {
                        pagination: paginationInfo,
                        data: data.recordset
                    };
                    console.log(result);
                    resolve(result);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};


const getDetail = async function (id, result) {
    console.log("Id service", id);
    var pool = await conn;
    var sqlString = "  SELECT * FROM DRIVER WHERE Id = @id ";
    return await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query(sqlString, function (err, data) {
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
    if (!isValidUUID(newGuid)) {
        console.error("Invalid GUID:", newGuid);
        return;
    }
    console.log("original newData", newData);
    const structuredData = {
        Id: newGuid,
        Name: newData.Fullname,
        ImageUrl: newData.ImageUrl,
        Phone: newData.Phone,
        Address: newData.Address,
        Password: newData.Password
    };
    console.log("structured newData", structuredData);
    // Convert the GUID to a SQL uniqueidentifier string
    const newGuidSql = newGuid;
    console.log("newGuidsql", newGuidSql)
    const status = "Vaild";
    var sqlString = "INSERT INTO Driver(Id, FullName, ImageUrl, Phone, Address, [UpDate], DegreeId, WalletId, Password, Status, InsDate) " +
        `VALUES(@id, @name, @img, @phone, @address, @update,  NULL, NULL, @password, 1, @insdate)`;

    return await pool.request()
        .input('id', sql.UniqueIdentifier, structuredData.Id)
        .input('name', sql.NVarChar, structuredData.Name)
        .input('img', sql.NVarChar, structuredData.ImageUrl)
        .input('phone', sql.NVarChar, structuredData.Phone)
        .input('address', sql.NVarChar, structuredData.Address)
        .input('update', sql.DateTime, format(new Date(), "'[UpDate]' yyyy-MM-dd HH:mm:ss"))
        .input('password', sql.NVarChar, structuredData.Password)
        .input('insdate', sql.DateTime, format(new Date(), "'Insdate' yyyy-MM-dd HH:mm:ss"))
        .query(sqlString, function (err, data) {
            if (err) {
                console.log("Data null", data);
                console.log("SQL Error:", err);
                result(true, null);
            } else {
                result(null, structuredData);
                console.log("newData after query", structuredData);
            }
        });
}


const update = async function (upData, id, result) {
    var pool = await conn;
    var sqlString = "  UPDATE Driver SET FullName = @name, ImageUrl = @img, Phone = @phone, Address = @address WHERE Id = @Id ";
    // var managerOld = getUserById(id);
    // console.log("DataUpdate", managerOld);
    return await pool.request()
        .input('name', sql.NVarChar, upData.FullName)
        .input('img', sql.NVarChar, upData.ImageUrl)
        .input('phone', sql.NVarChar, upData.Phone)
        .input('address', sql.NVarChar, upData.Address)
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
    var sqlString = "SELECT * FROM Driver WHERE Id = @id";
    const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query(sqlString);
    return result.recordset;
}

const banAccount = async function (id, result) {
    var pool = await conn;
    var sqlString = "  UPDATE Driver SET Status = 0 WHERE Id = @Id ";
    return await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .query(sqlString, function (err, data) {
            if (err) {
                console.error("Error updating record:", err);
                result(true, null);
            } else {
                console.log("Rows affected:", data.rowsAffected);
                result(null, data);
            }
        });
}

const exportList = async (list, res) => {
    try {
        // Sample data
        // const dataList = [
        //     { name: 'John Doe', phone: '123456789', address: 'New York' },
        //     { name: 'Jane Doe', phone: '987654321', address: 'San Francisco' },
        //     // Add more data as needed
        // ];

        // Define the CSV file header
        const csvHeader = [
            { id: 'name', title: 'FullName' },
            { id: 'phone', title: 'Phone' },
            { id: 'address', title: 'Address' },
            // Add more headers corresponding to your data properties
        ];

        const csvWriter = createCsvWriter({
            path: 'C:\Users\Asus\Downloads>\danh-sach-tai-xe.csv', // Output file path
            header: csvHeader,
        });
        console.log("List", list)
        // Write the data to the CSV file
        await csvWriter.writeRecords(list.body);

        res.status(200).json({ message: 'CSV file written successfully' });
    } catch (err) {
        console.error('Error writing CSV file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getAllDrivers,
    getDetail,
    create,
    update,
    banAccount,
    exportList
};
