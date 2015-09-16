var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart(),
    filer = require('jsonfile'),
    users = require('./users'),
    schools = require('./schools'),
    bookmarks = require('./bookmarks');

var app = express();

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.use('/request', multipartMiddleware);
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept');

    // Pass to next layer of middleware
    next();
});

/////////////////////////////////////////////////////////////////////////////
//  REST END POINTS
/////////////////////////////////////////////////////////////////////////////

// Users CRUD
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.post('/auth', users.authenticate);
// app.delete('/users/:id', users.deleteUser);

// School CRUD
app.get('/schools', schools.findAll);
app.get('/schools/:id', schools.findById);
app.post('/schools', schools.addSchool);
app.put('/schools/:id', schools.updateSchool);
app.delete('/schools/:id', schools.deleteSchool);

// Bookmarks CRUD
app.get('/bookmarks', bookmarks.findAll);
app.get('/bookmarks/one/:bid', bookmarks.findById);
app.get('/bookmarks/:user_id', bookmarks.findByUserId);
app.post('/bookmarks', bookmarks.addBookmark);
app.delete('/bookmarks/:id', bookmarks.deleteBookmark);

// Essays CRUD
app.post('/essays', bookmarks.addEssay);
app.get('/essays/:uid/:sid', bookmarks.getAllEssays);
app.put('/essays/:id', bookmarks.editEssayData);


// Admin Details
app.post('/admin', users.adminAuth);
app.listen(process.env.PORT || 3000);

