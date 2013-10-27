	Views.<%= _.classify(view) %> = Views.Base.extend({
		template: 'layouts/<%= _.underscored(view) %>',
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

