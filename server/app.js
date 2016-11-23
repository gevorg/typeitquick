'use strict';

// Those were part of express framework.
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

// Local modules.
const setupRoutes = require('./routes');
const contest = require('./contest');

// Setup application.
const setupApp = (app, express, io) => {
    // Body parser setup.
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Cookie setup.
    app.use(cookieParser());

    // Session setup.
    app.use(session({
        cookie: { maxAge: 60 * 60000 * 24 },
        secret: 'Johnny Was A Good Man',
        resave: true,
        saveUninitialized: true
    }));

    // Asset Setup.
    app.use('/', express.static(`${__dirname}/../client`));

    if ('production' !== process.env.NODE_ENV) {
        // Webpack.
        const webpack = require('webpack');
        const webpackConfig = require('../webpack.config');
        const compiler = webpack(webpackConfig);

        // Add webpack middleware.
        app.use(require('webpack-dev-middleware')(compiler));
    } else {
        // Build asset setup.
        app.use('/', express.static(`${__dirname}/../client/build`));
    }

    // Views setup.
    app.set('view engine', 'ejs');
    app.set('views', `${__dirname}/views`);

    // Setup routes.
    setupRoutes(app, io);

    // Setup contest.
    contest.setup();
};

// Export setup.
module.exports = setupApp;