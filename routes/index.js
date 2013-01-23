
exports.index = function(req,res){

  var templateData = {
    content : 'Hello World!!',
    title : 'ExpressJS Demo'
  }
  
  res.render('index', templateData);

};

exprts.page2 = function(req, res) {
  res.render('page2');
};