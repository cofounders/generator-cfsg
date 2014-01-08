	Views.<%= _.classify(name) %> = Backbone.View.extend({
		template: 'layouts/<%= _.underscored(name) %>',
		initialize: function (options) {
			this.options = options;
		},
		cleanup: function () {
		},
		events: {
		},
		serialize: function () {
			return this.model ? this.model.toJSON() :
                this.collection ? this.collection.toJSON() :
                {};
		},
		beforeRender: function () {
		},
		afterRender: function () {
		}
	});

