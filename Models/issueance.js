module.exports = (function () {
    var redis = require('redis')
    , client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    function issueance() { }
    issueance.generate = function generate() {
       client.hgetall("issued", function (err, obj) {
            //console.dir(obj);
       });
    }

    return issueance;

})();