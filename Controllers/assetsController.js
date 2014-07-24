module.exports = (function () {
    var assetModel = require('../Models/asset');

    function controller() { }

    controller.registerEndpoints = function registerEndpoints(app) {
        app.post('/asset', function (req, res) {
            assetCreate(req, res, false);
        });

        app.get('/asset', function (req, res) {
            console.log("asset");
            assetGetAll(res, res, false);
        });

        app.post('/testnet/asset', function (req, res) {
            assetCreate(req, res, true);
        });

        app.get('/testnet/asset', function (req, res) {
            assetGetAll(res, res, true);
        });

    }

    function assetGetAll(req, res, istestnet) {
        assetModel.getAll(istestnet, function (error, data) {
            res.send(200, data);
        });
    }

    function assetCreate(req, res, istestnet) {
        if (!req.hasOwnProperty("body")) {
            res.json(404, { error: 'no asset parameter found in body' });
            console.log(res.statusCode + " " + JSON.stringify({ error: 'no asset parameter found in body' }));
            return;
        }
        assetModel.generate(req.body, istestnet, function (err, data) {
            if (err) {
                res.json(404, { error: 'asset already exists' });
                console.log(res.statusCode + " " + JSON.stringify({ error: 'asset already exists' }));
            }
            else {
                res.json(200, data);
                console.log(res.statusCode + " " + JSON.stringify(data));
            }
        });
    }

    return controller;
})();