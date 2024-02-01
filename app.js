const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

const port = process.env.PORT || 5000;

const routePaths = [
    './routes/four-worker-api.js',
    './routes/api.js',
    './routes/user-api.js',
    './routes/queue-api.js',
];

routePaths.forEach(function (routePath, index) {
    var routes = require(routePath);
    // app.use('/', routes);
    if (index == 1) {
        app.use('/testing', routes);
    }
    else {
        app.use('/valid', routes);
    }
});

// const appRoutes = require('./routes/api.js');
// app.use('/api', appRoutes);
// app.use('/', appRoutes, cors());

app.listen(port, () => {
    console.log("server is running on port:" + port);
});

// module.exports = client;