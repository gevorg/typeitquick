# Export routes.
module.exports = (app) ->
  # Load time settings.
  app.get '/', (req, res) ->
    res.end 'Welcome to Type It Quick Test!'
