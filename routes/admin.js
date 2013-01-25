module.exports = function(app,mongoose) {
	var md = require( "markdown" );

	var forms = require('forms'),
		fields = forms.fields,
		validators = forms.validators,
		widgets = forms.widgets;


	//models
	var ClassNote = mongoose.model('ClassNote');

	var notes_entry_form = forms.create({
		title: fields.string({required: true}),
		urltitle: fields.string({required: true,label:'URL Slug'}),
		classdate: fields.string({required: true}),
		intro : fields.string({required: true, widget:widgets.textarea({class:'test',rows: 4}) }),
		notes : fields.string({required: true, widget:widgets.textarea({class:'test',rows: 6}) }),
		assignment : fields.string({required: true, widget:widgets.textarea({class:'test',rows: 6}) }),
		notesReady: fields.boolean({label:'Published?'})
	});

	app.get('/admin',function(req,res){

		// var classnote = new ClassNote({
		// 	title : 'Testing',
		// 	url_title : "testing_123"
		// });
		// classnote.save();
		templateData = {
			title : "DWD Admin",
			entry_form : notes_entry_form.toHTML()
		}
		res.render("admin/index.html",templateData);
	});

	app.post('/admin', function(req, res){

		notes_entry_form.handle(req, {
	        success: function (form) {
	            console.log(form.data);
	            output = md.markdown.toHTML( req.param('notes') );
				res.send(output);


	        },
	        error: function (form) {
	            // the data in the request didn't validate,
	            // calling form.toHTML() again will render the error messages
	            templateData = {
					title : "DWD Admin",
					entry_form : notes_entry_form.toHTML()
				}
				res.render("admin/index.html",templateData);
	        },
	        empty: function (form) {
	            // there was no form data in the request
	        }
	    });

		
	});


}
