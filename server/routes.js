// Configs.
const configs = require('./configs');

// Contest.
const contest = require('./contest');

// Request module.
const request = require('request');

// Setup function.
const setupRoutes = (app, io) => {
    // Current contest.
    app.get('/current', (req, res) => {
        // Get current contest.
        let currentContest = contest.current(io);

        // Remaining time.
        let remaining = Math.ceil((configs.CONTEST_START - Date.now() + currentContest.started) / 1000);

        // Response.
        res.json({
            contest: JSON.stringify(currentContest),
            userId: req.sessionID,
            remaining: remaining
        })
    });

    // Join request.
    app.post('/join', (req, res) => {
        if (req.body.captcha && req.body.id) {
            request(`${configs.CAPTCHA_URL}${req.body.captcha}&remoteip=${req.ip}`, (error, response, body) => {
                if (JSON.parse(body).success) {
                    contest.join(req.sessionID, req.body.id);
                    res.json({
                        id: req.sessionID,
                        duration: Math.ceil((configs.CONTEST_DURATION - configs.CONTEST_START) / 1000)
                    });
                } else {
                    res.status(400).send('Captcha validation failed!');
                }
            });
        } else {
            res.status(400).send('Missing parameters!');
        }
    });

    // Load index page.
    app.get('/', (req, res) => {
        // Render contest.
        res.render('index', {
            captchaKey: configs.CAPTCHA_KEY,
            siteUrl: configs.SITE_URL
        });
    });
};

// Export setup.
module.exports = setupRoutes;