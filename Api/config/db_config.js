const mysql = require('mysql');

const connectDB = async () => {
    try {
        const pool = await mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'your_database_name',
            connectionLimit: 10, 
        });
        console.log('Connected to MySQL database');
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error);
        throw new Error('Database connection failed');
    }
};

module.exports = connectDB;
