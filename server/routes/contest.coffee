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
    created: Date.now()
    state: 'Waiting'
    words: words
    users: [
      {
        name: user
        progress: 0
        joined: false
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

  # Join contest.
  app.post '/contest/join', (req, res) ->
    if req.body.id
      # Fetching contest.
      contest = contests[req.body.id]

      # If it is valid.
      if contest && contest.state == 'Waiting'
        if req.session.hasOwnProperty contest.id
          res.json [contest, req.session[contest.id]]
        else
          if contest.users.length == 1 && !contest.users[0].joined
            user = contest.users[0]
            user.joined = true

            # Save session info.
            req.session[contest.id] = 0

            # Return result.
            res.json [contest, 0]
          else
            (res.status 401).send 'Need to join!'
      else
        (res.status 400).send 'Contest not found!'
    else
      (res.status 400).send 'Missing contest id!'

  # Join contest.
  app.put '/contest/join', (req, res) ->
    if req.body.user && req.body.captcha && req.body.id
      # Fetching contest.
      contest = contests[req.body.id]
      if contest && contest.state == 'Waiting'
        # Verifying captcha.
        request configs.CAPTCHA.VERIFY_URL + req.body.captcha + '&remoteip=' + req.ip, (error, response, body) ->
          if JSON.parse(body).success
            #  New user.
            user = {
              name: req.body.user
              progress: 0
              joined: true
            }

            # Join contest.
            newLength = contest.users.push user

            # Session.
            req.session[contest.id] = newLength - 1

            # Return result.
            res.json [contest, newLength - 1]
          else
            (res.status 400).send 'CAPTCHA validation failed!'
      else
        (res.status 400).send 'Cannot join contest!'
    else
      (res.status 400).send 'Missing request parameters!'

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