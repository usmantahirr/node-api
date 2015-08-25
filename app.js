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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies
app.use('/request', multipartMiddleware);
app.use(cors());
app.use(function (req, res, next) {

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
//  VARIABLES
/////////////////////////////////////////////////////////////////////////////
var files = {
    schools: 'allSchools.json',
    bookmarks: 'bookmarkedSchools.json',
    classProfiles: 'classProfile.json',
    users: 'users.json',
    admins: 'admins.json'
};

var allSchools = filer.readFileSync(files.schools);
var bookmarkedSchools = filer.readFileSync(files.bookmarks);
// var users = filer.readFileSync(files.users);
var classProfiles = filer.readFileSync(files.classProfiles);


/////////////////////////////////////////////////////////////////////////////
//  REST END POINTS
/////////////////////////////////////////////////////////////////////////////

app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.post('/auth', users.authenticate);
// app.delete('/users/:id', users.deleteUser);

app.get('/schools', schools.findAll);
app.get('/schools/:id', schools.findById);
app.post('/schools', schools.addSchool);

//app.get('/users', function (req, res) {
//    res.json();
//});

//app.get('/schools', function (req, res) {
//    res.json(allSchools);
//});
//

app.get('/bookmarks', bookmarks.findAll);
app.get('/bookmarks/:user_id', bookmarks.findById);
app.post('/bookmarks', bookmarks.addBookmark);

app.get('/bookmarked-schools', function (req, res) {
    res.json(bookmarkedSchools);
});

app.post('/bookmarked-schools', function (req, res) {
    filer.writeFile(files.bookmarks, req.body, function () {
        filer.readFile(files.bookmarks, function (error, object) {
            bookmarkedSchools = object;
            res.send(bookmarkedSchools);
        });
    });
});

app.get('/class-profile/:id', function (req, res) {
    res.json(classProfiles);
    console.log();
});

app.listen(3000);
