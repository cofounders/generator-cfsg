define([
	'jquery', 'underscore', 'backbone', 'app',
	'backbone.analytics',
	'modules/Layouts'
], function (
	$, _, Backbone, app,
	bbAnalytics,
	Layouts
) {
	return Backbone.Router.extend({

		routes: {
			'': 'landing',
			'*path': '404'
		},

		landing: function () {
			app.useLayout(Layouts.Views.Landing, {
			}).setViews({
			}).render();
		},

		404: function () {
			app.useLayout(Layouts.Views['404'], {
			}).render();
		}

	});
});
