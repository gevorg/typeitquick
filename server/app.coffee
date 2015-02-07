module.exports = (app, express, io) ->
  # Those were part of express framework.
  bodyParser = require 'body-parser'
  flash = require 'connect-flash'
  cookieParser = require 'cookie-parser'
  session = require 'express-session'

  # Configs.
  ## Request middle-wares.
  app.use bodyParser.urlencoded({ extended: false })
  app.use bodyParser.json()

  ## Cookie parser.
  app.use cookieParser()

  ## Session initializer.
  app.use session({
    cookie: { maxAge: 60 * 60000 * 24 } # 24 hours.
    secret: 'Johnny Was A Good Man'
    resave: true
    saveUninitialized: true
  })

  ## Flash setup.
  app.use flash()

  ## Asset provider.
  assets = express.static __dirname + '/../client/assets'
  app.use '/assets', assets

  ## Bower components.
  bowerFiles = express.static __dirname + '/../client/components'
  app.use '/components', bowerFiles

  ## View engine.
  app.set 'view engine', 'ejs'

  ## View directory.
  app.set 'views', __dirname + '/views'

  # Setup routes.
  (require './routes') app, io