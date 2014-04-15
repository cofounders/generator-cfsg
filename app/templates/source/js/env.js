define(['underscore'], function (_) {
	var matchDomain = function (domains) {
		return function () {
			return _.contains(domains, window.location.host);
		};
	};

	return _.chain([{
		predicate: matchDomain(['www.example.com', 'example.com']),
		type: 'production',
		googletagmanager: {
			id: ''
		}
	}, {
		predicate: matchDomain(['beta.example.com']),
		type: 'staging',
		googletagmanager: {
			id: ''
		}
	}, {
		predicate: function () { return true; },
		type: 'development',
		googletagmanager: {
			id: ''
		}
	}])
	.find(function (env) { return env.predicate(); })
	.omit('predicate')
	.defaults({
		api: {
			base: 'http://api.example.com/'
		}
	})
	.value();
});
