function buildModels(mongoose) {

    var Schema = mongoose.Schema;

    Comments = new Schema({
      title     : String
    , body      : String
    , date      : Date
    });
    
    mongoose.model('Comment',Comments);
    
    
    var BlogPost = new Schema({
      title     : String
    , body      : String
    , buf       : Buffer
    , date      : Date
    , comments  : [Comments]
    , meta      : {
        votes : Number
        , favs  : Number
      }
    });
    
    mongoose.model('BlogPost',BlogPost);
    
    var assignment = new Schema({
        name : String,
        url : String,
        github : String,
        date : { type: Date, default: Date.now },
    });
    
    
    var ClassNote = new Schema({
        classdate   : Date,
        urltitle    : { type: String, lowercase: true, unique: true },
        title       : String,
        intro       : String,
        intro_md    : String,
        notes       : String,
        notes_md    : String,
        assignment  : String,
        assignment_md : String,
        notesReady  : String,
        published : String,
        lastupdated : { type: Date, default: Date.now },
        studentAssignments : [assignment]
    });
    
    mongoose.model("Assignment", assignment);
    mongoose.model('ClassNote',ClassNote);

    var pageSchema = new Schema({
        title     : String,
        body      : String,
        publishedstatus : String,
        lastupdated : { type: Date, default: Date.now }
    });
    mongoose.model('Page', pageSchema);
    
}

module.exports.buildModels = buildModels;