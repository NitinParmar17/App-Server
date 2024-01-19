const Queue = require('bull');
const router = require('./api');

// Create a new Bull queue connected to a Redis server
const myQueue = new Queue('myQueueName', 'redis://127.0.0.1:6379');

router.get('/queue', (req, res) => {

    // Event handler for completed jobs
    myQueue.on('completed', (job, result) => {
        console.log(`Job completed: ${JSON.stringify(job.data)}`);
    });

    // Event handler for failed jobs
    myQueue.on('failed', (job, err) => {
        console.error(`Job failed: ${JSON.stringify(job.data)}. Error: ${err.message}`);
    });

    console.log('Task scheduler started. Press Ctrl+C to exit.');
    myQueue.add({ data: 'some data' });

    // Process jobs from the queue
    myQueue.process((job) => {
        console.log(job.data); // Output: 'some data'
        res.json({ data: job.data });
        // Process the job here
    });
});

module.exports = router;