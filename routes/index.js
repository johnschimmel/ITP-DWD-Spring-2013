var mongoose = require('mongoose');
mongoose.connect('localhost', 'test');

var schema = mongoose.Schema({ name: 'string' });
var Cat = mongoose.model('Cat', schema);


exports.index = function(req,res){
  var templateData = {
    content : 'Hello World!!',
    title : 'ExpressJS Demo'
  }
  
	var kitty = new Cat({ name: 'Zildjian' });
	kitty.save(function (err) {
	  if (err) // ...
	  console.log('meow');
	});

  res.render('index', templateData);
};

exports.page2 = function(req, res) {
  res.render('page2');
};