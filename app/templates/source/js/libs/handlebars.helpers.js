define([
	'handlebars',
	'handlebars-helpers-pack/currency',
	'handlebars-helpers-pack/encodeURIComponent'
], function (
	Handlebars,
	currency,
	encodeURIComponent_helper
) {
	Handlebars.registerHelper('$', currency);
	Handlebars.registerHelper('encodeURIComponent', encodeURIComponent_helper);

	return Handlebars;
});
