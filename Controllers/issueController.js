module.exports = (function () {
    var issueModel = require('../Models/issueance');

    function controller() { }
    controller.registerEndpoints = function registerEndpoints(app) {
        app.post('/issue/:key', function (req, res) {
            if (!req.hasOwnProperty("body")) {
                res.json(404, { error: 'no issueance parameter found in body' });
                console.log(res.statusCode + " " + JSON.stringify({ error: 'no issueance parameter found in body' }));
                return;
            }
            console.log("generating new issueance");
            issueModel.generate(req.params.key, req.body, function (err, data) {
                if (err) {
                    res.json(404, err);
                    console.log(res.statusCode + " " + JSON.stringify(err));
                }
                else {
                    res.json(200, data);
                    console.log(res.statusCode + " " + JSON.stringify(data));
                }
            });

        });

        app.get('/issue', function (req, res) {
            issueModel.getAll(function (error, data) {
                res.send(200, data);
            });
        });

    }



    return controller;
})();