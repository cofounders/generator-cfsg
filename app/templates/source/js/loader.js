/*jslint maxlen: 240 */
require.config({
	baseUrl: '/js',
	deps: ['main'],
	paths: {
		'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min',
		'handlebars': '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0-rc.4/handlebars.min',
		'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min',
		'backbone.layoutmanager': '//cdnjs.cloudflare.com/ajax/libs/backbone.layoutmanager/0.8.8/backbone.layoutmanager.min',
		'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min',
		'backbone-loading': '../bower_components/backbone-loading/backbone-loading',
		'urlbuilder': '../bower_components/urlbuilder/urlbuilder',
		'handlebars-helpers-pack': '../bower_components/handlebars-helpers-pack/helpers',
		'doctit': '../bower_components/doctit/doctit',
		'googletagmanager': '../bower_components/googletagmanager/googletagmanager',
		'backbone.analytics': '../bower_components/backbone.analytics/backbone.analytics',
		'fastclick': '//cdnjs.cloudflare.com/ajax/libs/fastclick/0.6.7/fastclick.min'
	},
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'handlebars': {
			exports: 'Handlebars'
		},
		'jquery': {
			exports: 'jQuery'
		},
		'backbone.layoutmanager': {
			deps: ['backbone']
		},
		'underscore': {
			exports: '_'
		},
		'fastclick': {
			deps: ['jquery'],
			exports: 'FastClick'
		}
	}
});
