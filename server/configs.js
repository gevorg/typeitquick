// App configs.
const configs = {
    // Server configs.
    PORT: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000,
    SITE_URL: process.env.SITE_URL || 'http://localhost:5000/',

    // Captcha configs.
    CAPTCHA_KEY: process.env.CAPTCHA_APP_KEY,
    CAPTCHA_URL: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_APP_SEC}&response=`,

    // Contest configs.
    CONTEST_START: 30 * 1000,
    CONTEST_DURATION: 150 * 1000
};

// Export configs.
module.exports = configs;