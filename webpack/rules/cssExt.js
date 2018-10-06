const PATHS = require('../paths');

module.exports = () => {
  return {
    test: /\.css$/,
		include: PATHS.modules,
		loader: 'style-loader!css-loader'
  };
};
