const sql = require('mssql/msnodesqlv8');

// Connection pool configuration
const config = {
    user: 'traxisystem@traxisystem',
    password: 'Admin3012024',
    server: 'traxisystem.database.windows.net',
    database: 'TraxiSystemv2',
    // user: 'sa',
    // password: '12345',
    // server: 'LAPTOP-HP6ERQBA\\SQLEXPRESS',
    // database: 'TraxiSystem',
    // driver: "msnodesqlv8",
    // Other optional configuration options can be added here
};

// Create a connection pool and connect to the database 
const conn = new sql.ConnectionPool(config);

conn.connect().then(pool => {
    console.log('Connected to SQL Server');
}).catch(err => {
    console.error('Error connecting to SQL Server:', err);
});

// Handle errors and release connection pool
conn.on('error', err => {
    console.error('SQL Server connection error:', err);
});

module.exports = {
    conn: conn,
    sql: sql
};
