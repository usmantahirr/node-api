var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('mba-deadlines', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'mba-deadlines' database");
        db.collection('schools', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'schools' collection doesn't exist.");
            }
        });
    }
});

module.exports.server = server;
module.exports.instance = db;
module.exports.BSON = BSON;
