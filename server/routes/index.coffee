# Configs.
configs = require '../configs'

# Import path module.
path = require 'path'

# File system.
fs = require 'fs'

# Favicon.
iconPath = path.resolve __dirname + '/../../client/assets/favicon.ico'
iconStat = fs.statSync iconPath

# Export routes.
module.exports = (app, io) ->
  # Contest routes.
  (require './contest')(app, io)

  # Load index page.
  app.get '/', (req, res) ->
    res.render 'index', {
      captchaKey: configs.CAPTCHA.APP_KEY
      siteUrl: configs.SITE_URL
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