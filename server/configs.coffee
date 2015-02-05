# Global configurations go here.
module.exports =
  PORT: process.env.PORT || 5000 # Web server port.
  # Captcha configs.
  CAPTCHA:
    APP_ID: process.env.CAPTCHA_APP_ID || '86891'
    APP_KEY: process.env.CAPTCHA_APP_KEY || '8ff8d18d471f604a908053bae05d600a'
    APP_SEC: process.env.CAPTCHA_APP_SEC || '21e0eb10ccf6fb113264479e9b4ce2a6'
