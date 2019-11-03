import express from 'express';
import webpack from 'webpack';
import SocketIo from 'socket.io';
import { isDebug } from '../config/app';
import { connect } from './db';
import initPassport from './init/passport';
import initExpress from './init/express';
import initRoutes from './init/routes';
import socketEvents from './init/socketEvents';
import renderMiddleware from './render/middleware';

const app = express();

require('dotenv').config();

// connect to MongoDB using mongoose - register mongoose Schema
connect();

// passport configuration
initPassport();

if (isDebug) {
  // enable webpack hot module replacement
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackConfig = require('../webpack/webpack.config');
  const devBrowserConfig = webpackConfig({ browser: true });
  const compiler = webpack(devBrowserConfig);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: devBrowserConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// Bootstrap application settings
initExpress(app);

// Note: Some of these routes have passport and database model dependencies
initRoutes(app);


app.get('*', renderMiddleware);

const server = app.listen(app.get('port'));

// socket Io
const io = new SocketIo(server, {path: '/api/tchat'});
socketEvents(io);
