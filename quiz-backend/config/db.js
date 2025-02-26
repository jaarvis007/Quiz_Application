const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost", // host should be a string
  user: "root", // user should be a string
  password: "Aman@2001", // password is fine
  database: "quiz_db", // database should be a string
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Export the promise-based pool
module.exports = pool.promise();

// Example to connect and query
async function connectToDatabase() {
  try {
    const [rows, fields] = await pool
      .promise()
      .query("SELECT 1 + 1 AS solution");
    console.log("Connection established, query result:", rows[0].solution); // This should log 2
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

connectToDatabase();
