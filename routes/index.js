
module.exports = function(app,mongoose) {

  var moment = require('moment'),
      async = require('async');

  //models
  var ClassNote = mongoose.model('ClassNote');
  var Page = mongoose.model('Page');



  app.get('/', function(req,res){
    async.parallel({
        notes: function(callback){
            // get all classnote items ordered by classdate
        ClassNote.find({},"title urltitle classdate").sort('classdate').exec(function(err, notes){

          for (n in notes) {
            notes[n].formattedDate = function() {
                  tmpDate = moment(this.classdate).add('minutes',moment().zone());
                  return moment(tmpDate).format("MMM Do");
              };
          }

          callback(null, notes);
          
        });

        },
        mainpage: function(callback){
            // get all classnote items ordered by classdate
          Page.findOne({urltitle:'mainpage'}).exec(function(err, page){
            callback(null, page);          
          });
        },
    },
    function(err, results) {
        templateData = {
          notes : results.notes,
          page : results.mainpage
          

        }
        res.render('index.html', templateData);
    });
  });



  
  app.get('/notes/:urltitle', function(req, res){
        async.parallel({
            notes: function(callback){
                // get all classnote items ordered by classdate
                ClassNote.find({},"title urltitle classdate").sort('classdate').exec(function(err, notes){

                  for (n in notes) {
                    notes[n].formattedDate = function() {
                          tmpDate = moment(this.classdate).add('minutes',moment().zone());
                          return moment(tmpDate).format("MMM Do");
                      };
                  }

                  callback(null, notes);
                  
                });

            },
            note: function(callback){
             
              ClassNote.findOne({urltitle:req.params.urltitle}, function(err, note){
                callback(null, note);
              });

            },

    },
    function(err, results) {
        templateData = {
          notes : results.notes,
          note : results.note
          

        }
        res.render('notes.html', templateData);
    });


    

  })

}
