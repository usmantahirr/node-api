var mongo = require('mongodb');

// Connect using the connection string
mongo.connect("mongodb://mba-admin:mba-admin@ds035563.mongolab.com:35563/mbadeadlines", {native_parser:true}, function(err, db) {
    if (err) console.log("err " + err.toString());
    if (db) console.log("db " + db.toString());
    module.exports.instance = db;
    module.exports.BSON = require('mongodb').ObjectID;
});
