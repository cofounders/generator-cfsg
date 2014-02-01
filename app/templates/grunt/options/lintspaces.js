module.exports = {
	options: {
		editorconfig: '.editorconfig'
	},
	source: {
		src: [
			'source/js/**/*.js',
			'source/styles/**/*.styl',
			'source/templates/**/*.html'
		]
	},
	tests: {
		src: [
			'grunt/**/*.js',
			'tests/**/*.js'
		]
	},
	project: {
		src: [
			'*.js',
			'*.json',
			'.*rc',
			'*.yml',
			'.sublime-project'
		]
	}
};
