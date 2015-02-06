# Configs.
configs = require '../configs'

# Contests.
contests = {}

# UUID module.
uuid = require 'node-uuid'

# Request module.
request = require 'request'

# Starting contest.
startContest = (words, user) ->
  # Create contest.
  contest = {
    id: uuid.v4()
    start: Date.now()
    state: 'Started'
    words: words
    users: [
      {
        name: user
        progress: 0
      }
    ]
  }

  # Add to cache.
  contests[contest.id] = contest

  # Return it.
  return contest.id

# Export routes.
module.exports = (app) ->
  # Contest view.
  app.get '/contest', (req, res) ->
    res.render 'contest'

  # Start contest.
  app.post '/contest/start', (req, res) ->
    if req.body.words && req.body.user && req.body.captcha
      # Verifying captcha.
      request configs.CAPTCHA.VERIFY_URL + req.body.captcha + '&remoteip=' + req.ip, (error, response, body) ->
        if JSON.parse(body).success
          res.end (startContest req.body.words, req.body.user)
        else
          (res.status 400).send 'CAPTCHA validation failed!'
    else
      (res.status 400).send 'Missing request parameters!'