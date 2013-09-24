var moment = require('moment'),
      async = require('async');

if (process.env.REDISTOGO_URL) {
  // TODO: redistogo connection
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]); 
  redis.on("error", function (err) {
      console.log("Error " + err);
  });

} 

var ClassNote = require('../models/classnote.js');
var Page = require('../models/page.js');

// main page
exports.index =  function(req,res){
  

  async.parallel({
      rd : function(callback) {
        redis.get("mycounter", function (err, data) {
            if (err) {
                return console.error("error response - " + err);
                callback(err, null);
            }
            console.log("Got redis key mycounter");
            console.log(data);
            var newVal = (data*1)+1;
            redis.set("mycounter",newVal);
            callback(null, newVal);
        });
      },
      notes: function(callback){
        // get all classnote items ordered by classdate
        ClassNote.find({}).sort('classdate').exec(function(err, notes){

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
};

// controller for individual note view
exports.notes = function(req, res){
  async.parallel({
      notes: function(callback){
          // get all classnote items ordered by classdate
          ClassNote.find({},"published title urltitle classdate").sort('classdate').exec(function(err, notes){

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
}

exports.pagedisplay = function(req, res) {

  async.parallel({
      notes: function(callback){
          // get all classnote items ordered by classdate
          ClassNote.find({},"published title urltitle classdate").sort('classdate').exec(function(err, notes){

            for (n in notes) {
              notes[n].formattedDate = function() {
                    tmpDate = moment(this.classdate).add('minutes',moment().zone());
                    return moment(tmpDate).format("MMM Do");
                };
            }

            callback(null, notes);
            
          });

      },
      page: function(callback){
       
        Page.findOne({urltitle:req.params.pageslug}, function(err, page){
          callback(null, page);
        });

      },

  },
  function(err, results) {
      var templateData = {
        notes : results.notes,
        page : results.page
      };
      res.render('page.html', templateData);
  });

}
