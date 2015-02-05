# Configs.
configs = require '../configs'

# Import path module.
path = require 'path'

# File system.
fs = require 'fs'

# Favicon.
iconPath = path.resolve __dirname + '/../../client/assets/favicon.ico'
iconStat = fs.statSync iconPath

# Sweet - sweet captcha.
sweetcaptcha = new require('sweetcaptcha')(configs.CAPTCHA.APP_ID, configs.CAPTCHA.APP_KEY, configs.CAPTCHA.APP_SEC)

# Export routes.
module.exports = (app) ->
  # Load index page.
  app.get '/', (req, res) ->
    res.render 'index'

  # Home view.
  app.get '/home', (req, res) ->
    sweetcaptcha.api 'get_html', (err, html) ->
      res.render 'home', {
        captcha: html
      }

  # Favicon.
  app.get '/favicon.ico', (req, res) ->
    # Send icon file.
    res.sendFile iconPath, {
      headers: {
        'Content-Type': 'image/x-icon',
        'Content-Length': iconStat.size
      }
    }