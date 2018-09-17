const PATHS = require('../paths');

module.exports = ({ production = false, browser = false } = {}) => {
  const enableHotModuleReplacement = !production && browser;

  const plugins = production ? [
      'transform-react-remove-prop-types',
      'transform-react-constant-elements',
      'transform-react-inline-elements'
  ]: [];

	let modules = [
		{
			loader: 'babel-loader',
			options: {
				// presets, // We use .babelrc
				plugins
			}
		}
	];

	if (enableHotModuleReplacement) {
		modules.push({
			// enforce: "pre", // only webpack 3
			loader: "eslint-loader",
			options: {
				emitWarning: true
			}
		})
	}

	return {
		test: /\.js$|\.jsx$/,
		use: modules,
		exclude: PATHS.modules
	};
};
