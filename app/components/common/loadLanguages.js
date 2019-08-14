function loadHighlightAssets(hljs) {
	// ['css', 'less', 'scss', 'javascript', 'java', 'php', 'cpp', 'ruby', 'scala', 'haml', 'xml', 'bash', 'sql', 'go', 'htmlbars', 'json', 'mathematica', 'python', 'coffeescript'];
	hljs.registerLanguage('scss', require('highlight.js/lib/languages/scss'));
	hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
	hljs.registerLanguage('java', require('highlight.js/lib/languages/java'));
	hljs.registerLanguage('php', require('highlight.js/lib/languages/php'));
	hljs.registerLanguage('css', require('highlight.js/lib/languages/css'));
	hljs.registerLanguage('cpp', require('highlight.js/lib/languages/cpp'));
	hljs.registerLanguage('ruby', require('highlight.js/lib/languages/ruby'));
	hljs.registerLanguage('scala', require('highlight.js/lib/languages/scala'));
	hljs.registerLanguage('haml', require('highlight.js/lib/languages/haml'));
	hljs.registerLanguage('xml', require('highlight.js/lib/languages/xml'));
	hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
	hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
	hljs.registerLanguage('go', require('highlight.js/lib/languages/go'));
	hljs.registerLanguage('htmlbars', require('highlight.js/lib/languages/htmlbars'));
	hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
	hljs.registerLanguage('less', require('highlight.js/lib/languages/less'));
	hljs.registerLanguage('mathematica', require('highlight.js/lib/languages/mathematica'));
	hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
	hljs.registerLanguage('coffeescript', require('highlight.js/lib/languages/coffeescript'));

	// CSS
	require('highlight.js/styles/paraiso-dark.css');
}

export { loadHighlightAssets };
