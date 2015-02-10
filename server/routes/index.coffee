# Configs.
configs = require '../configs'

# Import path module.
path = require 'path'

# File system.
fs = require 'fs'

# Favicon.
iconPath = path.resolve __dirname + '/../../client/assets/favicon.ico'
iconStat = fs.statSync iconPath

# Sitemap.xml.
sitemap = path.resolve __dirname + '/../../client/assets/sitemap.xml'

# Robots.txt.
robots = path.resolve __dirname + '/../../client/assets/robots.txt'

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

  # Robots.txt.
  app.get '/favicon.ico', (req, res) ->
    # Send file.
    res.sendFile robots, {
      headers: {
        'Content-Type': 'text/plain',
      }
    }

  # Sitemap.xml.
  app.get '/sitemap.xml', (req, res) ->
    # Send file.
    res.sendFile sitemap, {
      headers: {
        'Content-Type': 'text/xml',
      }
    }