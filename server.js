var express = require("express");
var bodyParser = require("body-parser");
var mongojs = require("mongojs");
var db = mongojs("todo", ["users", "tasks"]);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname));

app.get('/users', function (req, res) {
  db.users.find(function(error, documents) {
    var mapped = documents.map(function(element) {
      return {id: element._id, username: element.username};
    });
    console.log(mapped);
    if(error !== null) {console.log("Error occurred; error message is: ", error);}
    res.send(mapped);
  });
});

app.get('/tasks', function (req, res) {
  db.tasks.find(function(error, documents) {
    var mapped = documents.map(function(element) {
      return {id: element._id, title: element.title, description: element.description, creator: element.creator, assignee: element.assignee, status: element.status};
    });
    console.log(mapped);
    if(error !== null) {console.log("Error occurred; error message is: ", error);}
    res.send(mapped);
  });
});

app.post('/users', function (req, res) {
    db.users.find(function(error, documents) {
        db.users.insert(req.body, function(err, docs) {
        console.log(docs);
        res.send({id: docs._id});
      });
    });
});

app.put('/tasks/:id', function (req, res) {
    var id = req.params.id;
    db.tasks.findAndModify(
      {
        query: {_id: mongojs.ObjectId(id)},
        update: {$set: {"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status}},
        new: true
      },
      function(error, document) {
        console.log("Updated document contains: ", document);
        res.send({id: id});
      }
    );
});

app.post('/tasks', function (req, res) {
    var id;
    db.tasks.insert({"title" : req.body.title, "description" : req.body.description, "creator" : req.body.creator, "assignee" : req.body.assignee, "status": req.body.status}, function(error, documents) {
      console.log("New document added contains: ", documents);
      res.send({id: documents._id});
    });
});

app.listen(3000, function () {
  console.log("Server is running...........");
});
