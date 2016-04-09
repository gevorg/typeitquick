# Configs.
configs = require './configs'

# Contest.
contest = require './contest'

# Request module.
request = require 'request'

# Export routes.
module.exports = (app, io) ->
  # Current contest.
  app.get '/current', (req, res) ->
    # Get current contest.
    currentContest = contest.current(io)

    res.json {
      contest: JSON.stringify(currentContest)
      remaining: Math.ceil (configs.CONTEST.START - Date.now() + currentContest.started) / 1000
    }

  # Join request.
  app.post '/join', (req, res) ->
    if req.body.captcha && req.body.id
      # Verifying captcha.
      request configs.CAPTCHA.VERIFY_URL + req.body.captcha + '&remoteip=' + req.ip, (error, response, body) ->
        if JSON.parse(body).success
          contest.join req.sessionID, req.body.id
          res.json {
            id: req.sessionID
            duration: Math.ceil (configs.CONTEST.DURATION - configs.CONTEST.START) / 1000
          }
        else
          (res.status 400).send 'Captcha validation failed!'
    else
      (res.status 400).send 'Missing parameters!'

  # Load index page.
  app.get '/', (req, res) ->
    # Render contest.
    res.render 'index', {
      captchaKey: configs.CAPTCHA.APP_KEY
      siteUrl: configs.SITE_URL
    }
