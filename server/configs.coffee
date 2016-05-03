# Global configurations go here.
module.exports =
  PORT: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 5000 # Web server port.
  SITE_URL: process.env.SITE_URL || 'http://localhost:5000/'
  # Captcha configs.
  CAPTCHA:
    APP_KEY: process.env.CAPTCHA_APP_KEY
    APP_SEC: process.env.CAPTCHA_APP_SEC
    VERIFY_URL: 'https://www.google.com/recaptcha/api/siteverify?secret=' + process.env.CAPTCHA_APP_SEC + '&response='
  # Contest configs.
  CONTEST:
    START: 30 * 10000
    DURATION: 150 * 10000