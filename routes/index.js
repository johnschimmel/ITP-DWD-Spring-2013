
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
  
  app.get('/notes/:urltitle', function(req, res){

    ClassNote.findOne({urltitle:req.params.urltitle}, function(err, notes){
      if (err){
        res.send("unable to find")

      } else if (notes == null) {
        res.send("notes is null");

      } else
      {

        templateData = {
          notes : notes
        }
        res.render('notes.html', templateData);
      }

      

    });

  })

}
