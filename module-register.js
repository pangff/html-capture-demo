const path = require('path');

const registerRoute = function(server, route, moduleDir,moduleName) {
    let {
        method: routeMethod,
        name: routeName,
        version: routeVersion
    } = route.meta;
    routeMethod = routeMethod.toLowerCase();
    if (routeMethod == 'delete') {
        routeMethod = 'del';
    }
    route
        .meta
        .paths
        .forEach(function(aPath) {
            var routeMeta = {
                name: moduleDir +"/"+ moduleName+"/" + routeName,
                path: aPath,
                moduleDir: moduleDir,
                version: routeVersion
            };
            server[routeMethod](routeMeta, route.filter, route.action, route.finish);
        });

};

const setupRoute = function(server, moduleDir, moduleName) {
    const routes = require(path.join(__dirname, moduleDir, moduleName));
    routes.forEach((item) => {
        registerRoute(server, item, moduleDir,moduleName)
    });
};

/**
 * 注册
 * @param modules
 */
exports.register = (server, moduleDir, modules) => {
    /**
     * 设置module－route
     */
    modules.forEach((module) => {
        setupRoute(server, moduleDir, module)
    });

}