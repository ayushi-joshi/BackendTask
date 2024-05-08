const express=require('express')
const dotenv = require('dotenv').config();
const connectDB = require('./config/db_config');
const { errorhandler } = require('./Middleware/errorHandler');
const userRoutes = require('./Router/userRouter');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 9000;


connectDB()
    .then((connection) => {
        app.locals.db = connection;
        console.log('Connected to MySQL database');
    })
    .catch((error) => {
        console.error('Database connection failed:', error);
        process.exit(1);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ Message: 'Welcome to API' });
});

app.use('/api/auth', userRoutes);


app.use(errorhandler);

app.listen(PORT, () => {
    console.log(`Server is running at PORT: ${PORT}`);
});