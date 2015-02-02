# Import path module.
path = require 'path'

# Favicon path.
icon = path.resolve __dirname + '/../../client/assets/favicon.ico'

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
    res.sendFile icon
