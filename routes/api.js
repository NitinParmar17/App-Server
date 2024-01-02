const express = require("express");
const router = express.Router();
const { Worker } = require("worker_threads");

const connection = require('../dbConnection.js');

router.get('/abc', (req, res) => {
    console.log("hello");
    const query = 'SELECT * FROM user'; // Replace 'users' with your table name

    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'Error fetching data' });
            return;
        }
        res.json({ data: results }); // Send fetched data as a JSON response
    });
});

router.get("/non-blocking/", (req, res) => {
    res.status(200).send("This page is non-blocking");
});

router.get("/blocking/", async (req, res) => {
    const worker = new Worker("./routes/worker.js");

    worker.on("message", (data) => {
        res.status(200).send(`result is ${data}`);
    });

    worker.on("error", (error) => {
        res.status(404).send(`An error occured ${error}`);
    });
    // let counter = 0;
    // for (let i = 0; i < 20_000_000_000; i++) {
    //     counter++;
    // }
    // res.status(200).send(`result is ${counter}`);
});

module.exports = router;

