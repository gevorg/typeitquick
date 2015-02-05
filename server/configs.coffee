# Global configurations go here.
module.exports =
  PORT: process.env.PORT || 5000 # Web server port.
  # Captcha configs.
  CAPTCHA:
    APP_KEY: process.env.CAPTCHA_APP_KEY
    APP_SEC: process.env.CAPTCHA_APP_SEC
