	Views.<%= _.classify(name) %> = Views.Base.extend({
		template: 'layouts/<%= _.underscored(name) %>',
		initialize: function (options) {
			this.options = options;
		},
		cleanup: function () {
		},
		events: {
		},
		serialize: function () {
			return this.model.toJSON();
		},
		beforeRender: function () {
		},
		afterRender: function () {
		}
	});

