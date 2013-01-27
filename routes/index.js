
module.exports = function(app,mongoose) {

  //models
  var ClassNote = mongoose.model('ClassNote');
  var moment = require('moment');



  app.get('/admin', function(req,res){

    if (!req.user) {
      res.redirect('/admin/login');
    }

    async.parallel({
        notes: function(callback){
            // get all classnote items ordered by classdate
        ClassNote.find({}).sort('classdate').exec(function(err, notes){

          for (n in notes) {
            notes[n].formattedDate = function() {
                  tmpDate = moment(this.classdate).add('minutes',moment().zone());
                  return moment(tmpDate).format("YYYY-MM-DD");
              };
          }

          callback(null, notes);
          
        });

        },
        mainpage: function(callback){
            // get all classnote items ordered by classdate
          Page.findOne({urltitle:mainpage}).exec(function(err, page){
            callback(null, page);          
          });
        },
    },
    function(err, results) {
        
        templateData = {
          notes : results.notes,
          page : results.mainpage
          

        }
        res.render('admin/index.html', templateData);
    });
  });


  app.get('/',function(req,res){

    ClassNote.find({}).sort('classdate').exec(function(err, notes){

        for (n in notes) {
          notes[n].formattedDate = function() {
                tmpDate = moment(this.classdate).add('minutes',moment().zone());
                return moment(tmpDate).format("YYYY-MM-DD");
            };
        }

        templateData = {
          notes : notes,
          
        }

        res.render('index.html',templateData);

    })


    // var templateData = {
    //   content : 'Hello World!!',
    //   title : 'DWD Admin'
    // }
    // res.render('index.html', templateData);

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
