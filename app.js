
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

// Express app configuration 
app.configure(function(){

  //  templates directory
  app.set('views', __dirname + '/views');

  // setup template engine - we're using Hogan-Express
  // https://github.com/vol4ok/hogan-express
  app.set('view engine', 'html');
  app.set('layout','layout');
  app.engine('html', require('hogan-express'));


  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  
  // css, images and js
  app.use(express.static(path.join(__dirname, 'public')));

});


app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res) {
  
  var templateData = {
    content : 'Hello World!!',
    title : 'ExpressJS Demo'
  }
  
  res.render('index', templateData);

});

app.get('/page2', function(req, res) {
  res.render('page2');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);

});
