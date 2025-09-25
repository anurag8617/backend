// const mysql = require("mysql2/promise");
// require("dotenv").config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err);
//     return;
//   }
//   console.log("✅ Connected to MySQL database");
// });

// module.exports = db;

// anurag8617/backend/backend-904461aac3b98b9326c9f4a47b47407869a6a12d/config/db.js

// anurag8617/backend/backend-904461aac3b98b9326c9f4a47b47407869a6a12d/config/db.js

// anurag8617/backend/backend-904461aac3b98b9326c9f4a47b47407869a6a12d/config/db.js
// anurag8617/backend/backend-904461aac3b98b9326c9f4a47b47407869a6a12d/config/db.js

const mysql = require("mysql2/promise");
require("dotenv").config();

// This creates a connection pool that works with async/await
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection when the application starts
pool
  .getConnection()
  .then((connection) => { 
    console.log("✅✅✅ SUCCESS: Connected to MySQL database! ✅✅✅");
    connection.release();
  })
  .catch((err) => {
    console.error(
      "❌❌❌ ERROR: Could not connect to MySQL database. Please check your .env file and database server. ❌❌❌"
    );
    console.error(err);
  });

module.exports = pool;
