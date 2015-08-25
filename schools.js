var db = require('./db'),
    collection = 'schools';

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving users: ' + id);
    db.instance.collection(collection, function(err, collection) {
        collection.findOne({'_id':new db.BSON.ObjectID(id)}, function(err, item) {
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

exports.addSchool = function(req, res) {
    var school = req.body;
    console.log('Adding Schools: ' + JSON.stringify(wine));
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
//
//exports.updateUser = function(req, res) {
//    var id = req.params.id;
//    var wine = req.body;
//    console.log('Updating wine: ' + id);
//    console.log(JSON.stringify(wine));
//    db.collection('wines', function(err, collection) {
//        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
//            if (err) {
//                console.log('Error updating wine: ' + err);
//                res.send({'error':'An error has occurred'});
//            } else {
//                console.log('' + result + ' document(s) updated');
//                res.send(wine);
//            }
//        });
//    });
//};
//
//exports.deleteUser = function(req, res) {
//    var id = req.params.id;
//    console.log('Deleting user: ' + id);
//    db.collection('user', function(err, collection) {
//        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
//            if (err) {
//                res.send({'error':'An error has occurred - ' + err});
//            } else {
//                console.log('' + result + ' document(s) deleted');
//                res.send(req.body);
//            }
//        });
//    });
//};
