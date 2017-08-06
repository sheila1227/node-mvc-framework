const url = require('url');

const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'];

const defaultErrorHander = (err, req, res) => {
    res.statusCode = 500;
    res.end();
};

const getRoutePattern = pathname => {
  pathname = '^' + pathname.replace(/(\:\w+)/g, '\(\[a-zA-Z0-9-\\s\]\+\)') + '$';
  return new RegExp(pathname);
};

const addParamsToRequest = (req, routePath, matchedResults) => {
    req.params = {};
    let urlParameterNames = routePath.match(/:(\w+)/g);
    if (urlParameterNames) {
        for (let i=0; i < urlParameterNames.length; i++) {
            req.params[urlParameterNames[i].slice(1)] = matchedResults[i + 1];
        }
    }
}

module.exports = (errorHander) => {
    const routes = [];

    const router = (req, res) => {
        const pathname = decodeURI(url.parse(req.url).pathname);
        const method = req.method.toLowerCase();
        let i = 0;
        errorHander = errorHander || defaultErrorHander;

        const next = (err) => {
            if (err) return errorHander(err, req, res);
            route = routes[i++];
            if (!route) return;
            const routeForAllRequest = !route.method && !route.path;
            if (routeForAllRequest) {
                route.handler(req, res, next);
            } else {
                const matchedResults = pathname.match(route.pattern);
                if (route.method === method && matchedResults) {
                    addParamsToRequest(req, route.path, matchedResults);
                    route.handler(req, res, next);
                } else {
                    next();
                }
            }
        }

        next();
    };

    router.use = (fn) => {
        routes.push({
            method: null,
            path: null,
            pattern: null,
            handler: fn
        });
    };

    METHODS.forEach(item => {
        const method = item.toLowerCase();
        router[method] = (path, fn) => {
            routes.push({
                method,
                path,
                pattern: getRoutePattern(path),
                handler: fn
            });
        };
    });

    router.all = (path, fn) => {
        METHODS.forEach(item => {
            const method = item.toLowerCase();
            router[method](path, fn);
        })
    };

    return router;
};