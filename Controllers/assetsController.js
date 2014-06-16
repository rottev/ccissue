module.exports = (function () {
    var assetModel = require('../Models/asset');

    function controller() { }

    controller.registerEndpoints = function registerEndpoints(app) {
        app.post('/asset', function (req, res) {
            if (!req.hasOwnProperty("body")) {
                res.json(404, { error: 'no asset parameter found in body' });
                console.log(res.statusCode + " " + JSON.stringify({ error: 'no asset parameter found in body' }));
                return;
            }
            assetModel.generate(req.body, function (err, data) {
                if (err) {
                    res.json(404, { error: 'asset already exists' });
                    console.log(res.statusCode + " " + JSON.stringify({ error: 'asset already exists' }));
                }
                else {
                    res.json(200, data);
                    console.log(res.statusCode + " " + JSON.stringify(data));
                }
            });
        });

        app.get('/asset', function (req, res) {
            assetModel.getAll(function (error, data) {

                res.send(200, data);
              //  console.log(res.statusCode + " " + JSON.stringify(data));
            });
        });

    }

    return controller;
})();