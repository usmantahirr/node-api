var db = require('./db');

exports.findById = function(req, res) {
    var id = req.params.id;
	var oid = new db.BSON.ObjectID(id);
    console.log('Retrieving user: ' + id);
    db.instance.collection('users', function(err, collection) {
        collection.findOne({'_id':oid}, function(err, item) {
            res.send(item);
        });
    });
};


exports.authenticate = function (req, res) {
    var email = req.body.email,
        password = req.body.password;

    db.instance.collection('users', function(err, collection) {
        collection.findOne({'email': email, 'password': password}, function (err, item) {
            if (item) {
                res.send(item);
            } else {
                res.send(err);
            }
        });
    });
};

exports.findAll = function(req, res) {
    db.instance.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addUser = function(req, res) {
    var user = req.body;
	if ( user.email == null || user.email==""){
		res.status(400);
		res.send({'error':'Email Address Missing'});
	} else if(user.first_name == null || user.first_name==""){
		res.status(400);
		res.send({'error':'First Name  Missing'});
	} else if(user.last_name == null || user.last_name==""){
		res.status(400);
		res.send({'error':'Last Name  Missing'});
	} else if(user.password == null || user.password==""){
		res.status(400);
		res.send({'error':'Password Missing'});
	} else if(user.billing_address == null || user.billing_address==""){
		res.status(400);
		res.send({'error':'Billing Address Missing'});
	} else if(user.state == null || user.state==""){
		res.status(400);
		res.send({'error':'State Missing'});
	}else {
		console.log('Adding users: ' + JSON.stringify(user));
		try {
			db.instance.collection('users', function(err, collection) {
				collection.insert(user, {safe:true}, function(err, result) {
					if (err) {
						if(err.errmsg.indexOf("dup key:") > -1){
							res.status(400);
							res.send({'error':'Email address already in use'});
						} else {
							res.status(400);
							res.send({'error':'An unknown error has occurred'});
						}
						
					} else {
						console.log('Success: ' + JSON.stringify(result.ops[0]));
						res.send(result.ops[0]);
					}
				});
			});
		} catch (errs){
			res.status(400);
			res.send({'error':'An unknown error has occurred ex'});
		}
	}
};




exports.updateUser = function(req, res) {
    var id = req.params.id;
   	var user = req.body;   
	console.log('Updating user: ' + id);
    console.log(JSON.stringify(user));
    try {
		db.instance.collection('users', function(err, collection) {
			idO=new db.BSON.ObjectID(id);
			collection.update({'_id':idO}, { $set:  user  }, function(err, result) {
				if (err) {
					console.log('Error updating user: ' + err);
					res.send({'error':'An error has occurred'});
				} else {
					if(result.result.n==0){						
						res.send({'error':'No User Found'});
					} else {
						console.log('' + result + ' document(s) updated');
						res.send({'Success':'User Information Updated'});
					}
				}
			});		
		});
	} catch (errs){
			res.status(400);
			res.send({'error':'An unknown error has occurred ex'});
	}
};

exports.deleteUser = function(req, res) {
    var id = req.params.id;
    console.log('Deleting user: ' + id);
    db.collection('user', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};
