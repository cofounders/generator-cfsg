	Collections.<%= _.classify(name) %> = Backbone.Collection.extend({
		model: Models.<%= _.classify(name) %>,
		url: function () {
			return app.api('<%= _.underscored(name) %>');
		},
		parse: function (response) {
			return response;
		}
	});

