module.exports = (function () {
    var issueModel = require('../Models/issueance');

    function controller() { }
    controller.registerEndpoints = function registerEndpoints(app) {

        app.post('/issue/:key', function (req, res) {
            issueAsset(req, res, false);
        });

        app.get('/issue', function (req, res) {
            issueGetAssets(req, res, false);
        });

        app.post('/testnet/issue/:key', function (req, res) {
            issueAsset(req, res, true);
        });

        app.get('/testnet/issue', function (req, res) {
            issueGetAssets(req, res, true);
        });

    }

    function issueGetAssets(req, res, istestnet) {
        issueModel.getAll(istestnet, function (error, data) {
            res.send(200, data);
        });
    }

    function issueAsset(req, res, istestnet) {
        if (!req.hasOwnProperty("body")) {
            res.json(404, { error: 'no issueance parameter found in body' });
            console.log(res.statusCode + " " + JSON.stringify({ error: 'no issueance parameter found in body' }));
            return;
        }
        console.log("generating new issueance");
        issueModel.generate(req.params.key, req.body, istestnet, function (err, data) {
            if (err) {
                res.json(404, err);
                console.log(res.statusCode + " " + JSON.stringify(err));
            }
            else {
                res.json(200, data);
                console.log(res.statusCode + " " + JSON.stringify(data));
            }
        });
    }

    return controller;
})();