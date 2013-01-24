var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI);

var models = require('../models.js').buildModels(mongoose);
var ClassNote = mongoose.model('ClassNote');
// var schema = mongoose.Schema({ name: 'string' });
// var Cat = mongoose.model('Cat', schema);


exports.index = function(req,res){
  var templateData = {
    content : 'Hello World!!',
    title : 'ExpressJS Demo'
  }
  

  var classnote = new ClassNote({
  	title : 'Testing',
  	url_title : "testing_123"
  });
  classnote.save();
	// var kitty = new Cat({ name: 'Zildjian' });
	// kitty.save(function (err) {
	//   if (err) // ...
	//   console.log('meow');
	// });
	console.log(process.env.name);

  res.render('index', templateData);
};

exports.page2 = function(req, res) {
  res.render('page2');
};