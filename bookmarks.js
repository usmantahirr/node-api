var db = require('./db'),
    collection = 'bookmarks';

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving bookmarks: ' + id);
    db.instance.collection(collection, function(err, collection) {
        collection.find({'user_id': id}).toArray(function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.instance.collection(collection, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addBookmark = function(req, res) {
    var school = req.body;
    console.log('Adding Schools: ' + JSON.stringify(school));
    db.instance.collection(collection, function(err, collection) {
        collection.insert(school, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};
