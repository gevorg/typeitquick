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
    app.use('/', express.static(`${__dirname}/../client-build`));

    // Setup routes.
    setupRoutes(app, io);

    // Setup contest.
    contest.setup();
};

// Export setup.
module.exports = setupApp;