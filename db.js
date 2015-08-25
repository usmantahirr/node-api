var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

//var server = new Server('evennode.com', 27017, {auto_reconnect: true});
//db = new Db('app_1092', server);
var dbInstance = '';

//db.open(function(err, db) {
//    if(!err) {
//        console.log("Connected to 'mba-deadlines' database");
//        db.collection('schools', {strict:true}, function(err, collection) {
//            if (collection) {
//                console.log(collection.toString());
//            }
//            if (err) {
//                console.log(err.toString());
//            }
//        });
//    }
//});

// Connect using the connection string
mongo.connect("mongodb://app_1092:app_1092@evennode.com:27017/app_1092", {native_parser:true}, function(err, db) {
    if (err) console.log("err " + err.toString());
    if (db) console.log("db " + db.toString());
    module.exports.instance = db;
});

// module.exports.server = server;
module.exports.BSON = BSON;
