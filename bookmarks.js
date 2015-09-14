var db = require('./db'),
	collection = 'bookmarks';


/**
 * Get all bookmarks against any user
 * @param user_id
 * @return list of all bookmarks against that user
 */
exports.findByUserId = function(req, res) {

	var userId = new db.BSON.ObjectID(req.params.user_id);

	db.instance.collection('bookmarks', function(err, collection) {
		collection.find({
			'user_id': userId
		}).toArray(function(err, items) {
			if (err) {
				res.status(400);
				res.send('Error: ' + err.toString());
			} else if (items) {
				if (items.length > 0) {
					var toSend = [];
					var bookmark = {};
					db.instance.collection('schools', function(err, schoolCollection) {
						schoolCollection.find().toArray(function(err, schools) {
							if (schools) {
								for (i in items) {
									for (j in schools) {
										if (items[i].school_id === schools[j]._id.toString()) {
											bookmark = schools[j];
											bookmark.selectedRound = items[i].selectedRound;
											bookmark.school_id = items[i].school_id;
											toSend.push(bookmark);
											bookmark = {};
										}
									}
								}
							}
							res.send(toSend);
						});
					});
				}
			} else {
				res.status(400);
				res.send('Unknown Error');
			}
		});
	});
};

/**
 * Black Function
 * Get bookmark on bookmark id
 */
exports.findById = function(req, res) {
	var id = req.params.bid;
	var bookmarkId = new db.BSON.ObjectID(id);
	db.instance.collection('bookmarks', function(err, collection) {
		collection.findOne({
			'_id': bookmarkId
		}, function(err, item) {
			res.send(item);
		});
	});
};


/**
 * Get all essays against one user for any school
 * @param  uid (User ID)
 * @param  sid (School ID)
 * @return essays written by user
 *
 * url/:uid/:sid
 */
exports.getEssay = function(req, res) {

	if (req.params.uid == null || req.params.uid == "") {
		res.status(400);
		res.send({
			'error': 'user_id Missing'
		});
	} else if (req.params.sid == null || req.params.sid == "") {
		res.status(400);
		res.send({
			'error': 'school_id Missing'
		});
	} else {
		var user_id = req.params.uid;
		var school_id = req.params.sid;

		var sid = new db.BSON.ObjectID(school_id);
		db.instance.collection('schools', function(err, schoolCollection) {
			schoolCollection.findOne({
				'_id': sid
			}, function(err, item) {
				sid = item;

				var essayInfo = sid.essays;

				db.instance.collection('essay_data', function(err, essayCollection) {
					essayCollection.find({
						'user_id': user_id,
						'school_id': school_id
					}).toArray(function(err, allEssayDetails) {

						for (i in allEssayDetails) {
							for (j in essayInfo) {
								if (allEssayDetails[i].essay_id == essayInfo[j].essayUUID.toString()) {
									allEssayDetails[i].limit = essayInfo[j].limit;
									allEssayDetails[i].required = essayInfo[j].required;
									allEssayDetails[i].question = essayInfo[j].question;
								}
							}

							//essaysToAdd[e].essayUUID=idO;				 
						}
						res.send(allEssayDetails);
					});
				});
			});
		});
	}
};

/**
 * 
 */
exports.addEssay = function(req, res) {
	var essay = req.body;
	if (essay.school_id == null || essay.school_id == "") {
		res.status(400);
		res.send({
			'error': 'school_id Missing'
		});
	} else if (essay.essay_id == null || essay.essay_id == "") {
		res.status(400);
		res.send({
			'error': 'essay_id Missing'
		});
	} else if (essay.user_id == null || essay.user_id == "") {
		res.status(400);
		res.send({
			'error': 'user_id Missing'
		});
	} else if (essay.essay_data == null || essay.essay_data == "") {
		res.status(400);
		res.send({
			'error': 'essay_data Missing'
		});
	} else {
		console.log('Adding essay_data: ' + JSON.stringify(essay));
		try {
			db.instance.collection('essay_data', function(err, essayCollection) {
				essayCollection.insert(essay, {
					safe: true
				}, function(err, result) {
					if (err) {
						res.status(400);
						res.send({
							'error': 'An unknown error has occurred'
						});
					} else {

						res.send(result.insertedIds[0]);
					}
				});
			});
		} catch (errs) {
			res.status(400);
			res.send({
				'error': 'An unknown error has occurred ex'
			});
		}
	}
};

exports.findAll = function(req, res) {
	db.instance.collection(collection, function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.addBookmark = function(req, res) {
	var selectedRound = req.body.selectedRound;
	var school_id = req.body._id;
	var user_id = new db.BSON.ObjectID(req.body.user_id);

	var toSave = {
		'selectedRound': selectedRound,
		'user_id': user_id,
		'school_id': school_id
	}

	console.log('Adding Bookmark Schools: ' + JSON.stringify(toSave));
	db.instance.collection(collection, function(err, collection) {
		collection.insert(toSave, {
			safe: true
		}, function(err, result) {
			if (err) {
				res.send({
					'error': 'An error has occurred'
				});
			} else {
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};

exports.deleteBookmark = function(req, res) {
	var id = req.params.id,
		user_id = req.query.user_id;

	db.instance.collection(collection, function(err, collection) {
		collection.remove({
			'_id': id
		}, {
			$elemMatch: {
				'user_id': user_id
			}
		}, function(err, result) {
			console.log(result);
			if (err) {
				res.send({
					'error': err.toString()
				});
			} else {
				res.sendStatus(200);
				console.log(id + ' deleted');
			}
		})
	});
};

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