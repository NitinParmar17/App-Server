const express = require("express");
const { resolve } = require("path");
const router = express.Router();
const { Worker, workerData } = require("worker_threads");

const THREAD_COUNT = 4;

router.get("/non-blocking/", (req, res) => {
    res.status(200).send("This page is non-blocking");
});


router.get("/blocking/", async (req, res) => {
    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
        workerPromises.push(createWorker());
    }

    const thread_results = await Promise.all(workerPromises);
    const total = thread_results[0] + thread_results[1] + thread_results[2] + thread_results[3];

    res.status(200).send(`result is ${total}`);
});

function createWorker() {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./routes/four-workers.js", {
            workerData: { thread_count: THREAD_COUNT }
        });

        worker.on("message", (data) => {
            resolve(data);
        });

        worker.on("error", (error) => {
            reject(error);
        });
    });
}
module.exports = router;

