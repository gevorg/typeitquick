# Import path module.
path = require 'path'

# File system.
fs = require 'fs'

# Favicon.
iconPath = path.resolve __dirname + '/../../client/assets/favicon.ico'
iconStat = fs.statSync iconPath

# Export routes.
module.exports = (app) ->
  # Load index page.
  app.get '/', (req, res) ->
    res.render 'index'

  # Home view.
  app.get '/home', (req, res) ->
    res.render 'home'

  # Favicon.
  app.get '/favicon.ico', (req, res) ->
    # Send icon file.
    res.sendFile iconPath, {
      headers: {
        'Content-Type': 'image/x-icon',
        'Content-Length': iconStat.size
      }
    }