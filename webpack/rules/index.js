const image = require('./image');
const javascript = require('./javascript');
const css = require('./css');
const cssExt = require('./cssExt');
const scss = require('./scss');

module.exports = ({ production = false, browser = false } = {}) => (
  [
    javascript({ production, browser }),
    css({ production, browser }),
    cssExt(),
    scss({ production, browser }),
    image()
  ]
);
