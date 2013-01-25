
module.exports = function(app,mongoose) {

  //models
  var ClassNote = mongoose.model('ClassNote');




  app.get('/',function(req,res){

    var classnote = new ClassNote({
      title : 'Testing',
      url_title : "testing_123"
    });
    classnote.save();


    var templateData = {
      content : 'Hello World!!',
      title : 'DWD Admin'
    }
    res.render('index.html', templateData);

  });
  

}
