module.exports = function(app,mongoose) {
	var md = require( "markdown" );
	var moment = require("moment");
	var passport = require("passport");

	var forms = require('forms'),
		fields = forms.fields,
		validators = forms.validators,
		widgets = forms.widgets;


	//models
	var ClassNote = mongoose.model('ClassNote');
	var User = mongoose.model('User');

	var notes_entry_form = forms.create({
		title: fields.string({required: true}),
		urltitle: fields.string({required: true,label:'URL Slug'}),
		classdate: fields.string({required: true}),
		intro : fields.string({required: true, widget:widgets.textarea({class:'test',cols:150,rows: 4}) }),
		notes : fields.string({required: true, widget:widgets.textarea({class:'test',cols:150,rows: 6}) }),
		assignment : fields.string({required: true, widget:widgets.textarea({class:'test',cols:150,rows: 6}) }),
		notesReady: fields.boolean({label:'Notes Ready?'}),
		published: fields.boolean({label:'Published?'}),
	});

	// register
	app.get('/admin/register', function(req, res) {
        res.render('admin/register.html', { });
    });

    app.post('/admin/register', function(req, res) {

    	if (req.body.password != req.body.confirm) {
    		return res.render('admin/register.html');
    	} else {

	        User.register(new User({ username : req.body.username }), req.body.password, function(err, new_user) {
	            if (err) {
	                return res.render('admin/register.html');
	            }
	            console.log("**********");
	            console.log(new_user);
	            res.redirect('/admin');
	        });
	    }

    });
    // end register

    // login
    app.get('/admin/login', function(req, res) {
        res.render('admin/login.html', { user : req.user });
    });

    app.post('/admin/login', passport.authenticate('local'), function(req, res) {
        res.redirect('/admin');
    });

    app.get('/admin/logout', function(req, res) {
        req.logout();
        res.redirect('/admin');
    });

	app.get('/admin', function(req,res){

		if (!req.user) {
			res.redirect('/admin/login');
		}
		
		// get all classnote items ordered by classdate
		ClassNote.find({}).sort('classdate').exec(function(err, notes){

			for (n in notes) {
				notes[n].formattedDate = function() {
			        tmpDate = moment(this.classdate).add('minutes',moment().zone());
			        return moment(tmpDate).format("YYYY-MM-DD");
			    };
			}

			templateData = {
				notes : notes,
				formatDate : function() {
					return function(dateObj) {
						console.log(typeof(dateObj));
						m = moment(dateObj);
						return m.format('MMMM Do YYYY, h:mm:ss a');
					}
				}
			}

			res.render('admin/index.html', templateData);
			
		})
		
	});

	app.get('/admin/edit/:documentid', function(req,res){

		notes_id = req.params.documentid;
		
		ClassNote.findById(notes_id, function(err, note){

			if (err) {
				res.send("unable to find the note");
			}


			formdata = {
				title : note.title,
				urltitle : note.urltitle,
				classdate : moment(note.classdate).add('minutes',moment().zone()).format('YYYY-MM-DD'),
				intro : note.intro_md,
				notes : note.notes_md,
				assignment : note.assignment_md,
				published : note.published


			}

			// attach note data to form
			editform = notes_entry_form.bind(formdata);

			// prepare template data
			templateData = {
				note : note,
				title : 'DWD Admin - ' + note.title,
				entry_form : editform.toHTML()

			}

			// render entry template
			res.render('admin/entry.html',templateData);
		});
		
	});

	app.get('/admin/entry',function(req,res){

		// var classnote = new ClassNote({
		// 	title : 'Testing',
		// 	url_title : "testing_123"
		// });
		// classnote.save();
		templateData = {
			title : "DWD Admin",
			entry_form : notes_entry_form.toHTML(),
			
		}
		res.render("admin/entry.html",templateData);
	});


	app.post('/admin/edit', function(req, res){

		notes_entry_form.handle(req, {
	        success: function (form) {

	        	if ( req.param('noteid') != undefined ) {
	        		
	        		ClassNote.findById(req.param('noteid'), function(err, classnote){

						if (err) {
							res.send("unable to find the note");
						}

						classnote.classdate = new Date(req.param('classdate'));
			        	classnote.title = req.param('title');
			        	classnote.urltitle = req.param('urltitle');
			        	classnote.intro_md = req.param('intro');
			        	classnote.intro = md.markdown.toHTML( req.param('intro') );
			        	classnote.notes_md = req.param('notes');
			        	classnote.notes = md.markdown.toHTML( req.param('notes') );
			        	classnote.assignment_md = req.param('assignment');
			        	classnote.assignment = md.markdown.toHTML( req.param('assignment') );
			        	classnote.notesReady = req.param('notesReady');
			        	classnote.published = req.param('published');
			        	classnote.save();

			        	res.redirect('/admin/edit/'+classnote.id);

					});

				} else {

		        	classnote = new ClassNote()

		        	classnote.classdate = new Date(req.param('classdate'));
		        	classnote.title = req.param('title');
		        	classnote.urltitle = req.param('urltitle');
		        	classnote.intro_md = req.param('intro');
		        	classnote.intro = md.markdown.toHTML( req.param('intro') );
		        	classnote.notes_md = req.param('notes');
		        	classnote.notes = md.markdown.toHTML( req.param('notes') );
		        	classnote.assignment_md = req.param('assignment');
		        	classnote.assignment = md.markdown.toHTML( req.param('assignment') );
		        	classnote.notesReady = req.param('notesReady');
		        	classnote.published = req.param('published');
		        	classnote.save();

		        	console.log(form.data);
		            output = md.markdown.toHTML( req.param('notes') );
					res.send(output);
	        	}
	            


	        },
	        error: function (form) {
	            // the data in the request didn't validate,
	            // calling form.toHTML() again will render the error messages
	            templateData = {
					title : "DWD Admin",
					entry_form : notes_entry_form.toHTML()
				}
				res.render("admin/entry.html",templateData);
	        },
	        empty: function (form) {
	            // there was no form data in the request
	        }
	    });

		
	});


}
