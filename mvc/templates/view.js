	Views.<%= _.classify(name) %> = Backbone.View.extend({
		template: '<%= _.slugify(_.humanize(module)) %>/<%= _.slugify(_.humanize(name)) %>',
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

