module.exports = (function () {
    var redis = require('redis')
    , jsonify = require('redis-jsonify')
    , client = jsonify(redis.createClient())
    , _ = require('lodash')
    , crypto = require('crypto')
    , Validator = require('jsonschema').Validator;

    var v = new Validator();

    var assetSchema = {
        "id": "/SimpleAsset",
        "type": "object",
        "properties": {
            "id": { "type": "string", "required": true },
            "name": { "type": "string", "required": true },
            "symbol": { "type": "string", "required": true },
            "satoshi_multiplyier": { "type": "decimal", "required": true }
        }
    };

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    function asset() { }
    asset.generate = function generate(assetin, next) {
        console.log(assetin);
        console.log(v.validate(assetin, assetSchema));

        client.hexists('asset', assetin.id, function (err, data) {
            if (data === 1) {
                next(new Error("Asset already exists"));
                return;
            }
            assetin.trusted = false;
            var seed = crypto.randomBytes(20);
            var key = crypto.createHash('sha1').update(seed).digest('hex');
            client.hmset('asset', assetin.id, assetin, function (err, data) {
                next(err, { key: key });
            });

            client.hmset('asset-key', assetin.id, key, function (err, data) {  });

        });
    }


    asset.getAll = function getAll(next) {
        client.hvals('asset', function (err, obj) {
            console.log(obj);

            try {
                var array = [];
                if (!_.isArray(obj)) {
                    array.push(JSON.parse(obj))
                }
                else {
                    for (var item in obj) {
                        console.log(obj[item]);
                        array.push(JSON.parse(obj[item]));
                    }
                }
                next(err, array);
            }
            catch (ex) {
                console.log("exception");
                next(ex, null);
            }

        });
    }

    return asset;

})();