module.exports = (function () {
    var redis = require('redis')
        , jsonify = require('redis-jsonify')
        , client = jsonify(redis.createClient())
        , _ = require('lodash')
        , crypto = require('crypto')
        , moment = require('moment')
        , Validator = require('jsonschema').Validator;

    var v = new Validator();

    var issueSchema = {
        "id": "/SimpleIssue",
        "type": "object",
        "properties": {
            "geneisistransaction": { "type": "string", "required": true },
            "outputindex": { "type": "integer", "required": true },
            "asssetId": { "type": "string", "required": true },
            //   "units": { "type": "integer", "required": true },
            "issuer": { "type": "string" },
            "description": { "type": "string" }
        }
    };

    client.on("error", function (err) {
        console.log("Error " + err);
    });


    function issueance() { }

    issueance.generate = function generate(key, issuanceObj, istestnet, next) {

        var result = v.validate(issuanceObj, issueSchema);
        if (result.errors.length > 0) {
            console.log("validation failed found.");
            console.log(result.errors);
            next({ error: result.errors[0] }, null);
            return;
        }
        issuanceObj.date = moment().format("YYYY-MM-DD");

        console.log(issuanceObj.asssetId);
        client.select(istestnet ? 1 : 0, function () {
            client.hget('asset-key', issuanceObj.asssetId, function (err, data) {
                if (key === data) {
                    client.hmset('issued', key, issuanceObj, function (err, data) {
                        next(err, data);
                    });
                }
                else {
                    next(new Error("Asset key doesnt match"));
                    return;
                }
            });
        });

    }


    issueance.getAll = function getAll(istestnet, next) {
        client.select(istestnet ? 1 : 0, function () {
            client.hvals('issued', function (err, obj) {

                try {
                    var array = [];
                    if (!_.isArray(obj)) {
                        array.push(JSON.parse(obj))
                    }
                    else {
                        for (var item in obj) {
                            array.push(JSON.parse(obj[item]));
                        }
                    }
                    next(err, array);
                }
                catch (ex) {
                    next(ex, null);
                }

            });
        });
    }

    return issueance;

})();