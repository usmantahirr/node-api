var mongo = require('mongodb');

// Connect using the connection string
mongo.connect("mongodb://app_1092:app_1092@evennode.com:27017/app_1092", {native_parser:true}, function(err, db) {
    if (err) console.log("err " + err.toString());
    if (db) console.log("db " + db.toString());
    module.exports.instance = db;
    module.exports.BSON = require('mongodb').ObjectID;
});
