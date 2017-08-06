const http = require('http');
const router = require('./lib/router')((err, req, res) => {
    console.error(err);
    res.statusCode = 500;
    res.end(err.stack);
});
const actorsController = require('./controllers/actors');

router.use((req, res, next) => {
    console.info('New request arrived');
    next();
});

router.get('/actors', (req, res) => {
    actorsController.getList(req, res);
});

router.get('/actors/:name', (req, res) => {
    actorsController.getActorByName(req, res);
});

router.get('/actors/:year/:country', (req, res) => {
    actorsController.getActorsByYearAndCountry(req, res);
});

router.use((req, res, next) => {
    res.statusCode = 404;
    res.end();
});

http.createServer(router).listen(9527, err => {
    if (err) {
        console.error(err);
        console.info('Failed to start server');
    } else {
        console.info(`Server started`);
    }
});