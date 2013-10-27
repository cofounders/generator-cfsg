	Models.<%= _.classify(name) %> = Backbone.Model.extend({
		url: function () {
			return app.api('<%= _.underscored(name) %>');
		},
		parse: function (response) {
			return response;
		}
	});

