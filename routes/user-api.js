const express = require("express");
const router = express.Router();

const connection = require('../dbConnection.js');
const redis = require("redis");
const redis_port = process.env.PORT || 6379;

const redisClient = redis.createClient({
    legacyMode: true,
    PORT: redis_port
});

// const client =
// http://localhost:5000/createUser/John/1234567890
// router.get('/createUser/:name/:phone', (req, res) => {

// http://localhost:5000/createUser?name=John&phone=1234567890
// router.get('/createUser', (req, res) => {


redisClient.connect().then(() => {
    console.log('Connected to Redis successfully!');
}).catch((err) => {
    console.error('Error connecting to Redis:', err);
});

// using redis
router.get('/createUser/:name/:phone', (req, res) => {
    try {
        console.log("abc");

        let name = req.params.name;
        let number = req.params.phone;
        const query = `SELECT * FROM user where name = '${name}' and phone = '${number}'`;

        connection.query(query, (error, results) => {
            console.log("hello");
            if (error) {
                console.error('Error fetching data:', error);
                res.status(500).json({ error: 'Error fetching data' });
                return;
            } else {
                if (results && results.length === 0) {
                    console.log(name);
                    const queryCreateUser = `INSERT INTO user (name, phone, age) VALUES ('${name}', '${number}', '30')`;
                    console.log(queryCreateUser);

                    connection.query(queryCreateUser, (createError, createResults) => {
                        if (createError) {
                            console.error('Error creating user:', createError);
                            res.status(500).json({ error: 'Error creating user' });
                            return;
                        }

                        console.log('User created:', createResults);
                        res.json({ message: 'User created successfully', user: { name, number } });
                    });
                } else {
                    res.json({ message: 'User with name and number already exists', user: { name, number } });
                }
            }
        });
    }
    catch (ex) {
        console.log(ex);
    }
});

router.get('/getUser/:phone', (req, res) => {
    try {
        let number = req.params.phone;

        redisClient.get(number, (err, reply) => {
            if (err) {
                console.error('Error getting value from Redis:', err);
                fetchFromDatabase();
            } else if (reply) {
                console.log('Value from Redis:', reply);
                res.json({ message: 'User Found in Redis', user: { name: reply, number } });
            } else {
                fetchFromDatabase();
            }
        });

        function fetchFromDatabase() {
            const query = `SELECT name FROM user WHERE phone = '${number}'`;

            connection.query(query, (error, results) => {
                if (error) {
                    console.error('Error fetching data:', error);
                    res.status(500).json({ error: 'Error fetching data' });
                } else {
                    let name = results[0]?.name || '';

                    redisClient.set(number, name, (err, reply) => {
                        if (err) {
                            console.error('Error setting value in Redis:', err);
                        } else {
                            console.log('Value set in Redis:', reply);
                        }
                    });

                    res.json({ message: 'User Found', user: { name, number } });
                }
            });
        }
    } catch (ex) {
        console.log(ex);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

