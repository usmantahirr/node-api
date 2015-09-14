var db = require('./db'),
    collection = 'schools';

exports.findById = function(req, res) {
    var id = req.params.id;
    var oid = new db.BSON.ObjectID(id);
    db.instance.collection('schools', function(err, collection) {
        collection.findOne({'_id':oid}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.instance.collection('schools', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addSchool = function(req, res) {
    var schoolo = req.body;	
	var essaysToAdd = schoolo.essays;	
	delete schoolo.essays;
	
	if ( schoolo.school == null || schoolo.school==""){
		res.status(400);
		res.send({'error':'School Name Missing'});
	} else {
		try {
			console.log('Adding Schools: ' + JSON.stringify(schoolo));   
			db.instance.collection('schools', function(err, collection) {
				collection.insert(schoolo, {safe:true}, function(err, result) {
					if (err) {						
							res.status(400);
							res.send({'error':'An unknown error has occurred'});						
					} else {
						 addEssayToSchool(result.insertedIds[0],essaysToAdd);						
						console.log('Success: ' + result.insertedIds[0].toString());
						res.send(result.insertedIds[0]);
					}
				});
			});
		} catch (errs){
			res.status(400);
			res.send({'error':'An unknown error has occurred ex'});
		}
	}
    
	
};

function addEssayToSchool(schoolID, essaysToAdd) {   	
	for(e in essaysToAdd){
		 if ( essaysToAdd[e].essayUUID == null || essaysToAdd[e].essayUUID==""){
				 idO=new db.BSON.ObjectID();
					essaysToAdd[e].essayUUID=idO;	
			} else {
				
			}
			 
	}	
	var toSave = {
		'essays': essaysToAdd
	}	
	try {
		db.instance.collection('schools', function(err, collection) {
			collection.update({'_id':schoolID}, { $set:  toSave  }, function(err, result) {
				if (err) {
					return false;				
				} else {
					if(result.result.n==0){						
						return false;		
					} else {
						return true;	
					}
				}
			});		
		});
	} catch (errs){
			return false;	
	}
}


exports.deleteSchool = function (req, res) {
    var id = db.BSON(req.params.id);

    db.instance.collection(collection, function (err, collection) {
        collection.remove({'_id': id}, function (err, result) {
            console.log(result);
            if (err) {
                res.send({'error': err.toString()});
            } else {								
				if(result.result.n==0){		
						res.status(400);				
						res.send({'error':'No School Found'});
					} else {
						res.status(200);
						res.send({'Success':'School Information Delete'});
					}               
            }
        })
    });
};

exports.updateSchool = function(req, res) {
    var id = req.params.id;
   	var schoolo = req.body;	
	var essaysToAdd = schoolo.essays;	
	delete schoolo.essays; 
	delete schoolo._id;
	
    try {
		db.instance.collection('schools', function(err, collection) {
			idO=new db.BSON.ObjectID(id);
			collection.update({'_id':idO}, { $set:  schoolo  }, function(err, result) {
				if (err) {
					console.log('Error updating School: ' + err);
					res.send({'error':'An error has occurred'});
				} else {
					if(result.result.n==0){						
						res.send({'error':'No School Found'});
					} else {
						addEssayToSchool(idO,essaysToAdd);
						console.log('' + result + ' document(s) updated');
						res.send({'Success':'School Information Updated'});
					}
				}
			});		
		});
	} catch (errs){
			res.status(400);
			res.send({'error':'An unknown error has occurred ex'});
	}
};



