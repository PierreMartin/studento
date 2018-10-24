module.exports = () => {
	return {
		test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		loader: 'file-loader'
	};
};
