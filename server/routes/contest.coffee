# Configs.
configs = require '../configs'

# Request module.
request = require 'request'

# IO service.
ioService = require '../io'

# Contest service.
contestService = require '../contest'

# Export routes.
module.exports = (app, io) ->
  # Start view.
  app.get '/start', (req, res) ->
    res.render 'start'

  # Chat view.
  app.get '/chat', (req, res) ->
    res.render 'chat'

  # Join view.
  app.get '/join', (req, res) ->
    res.render 'join'

  # Type view.
  app.get '/type', (req, res) ->
    res.render 'type'

  # Type.
  app.post '/type', (req, res) ->
    if req.body.id
      # Fetching contest.
      contest = contestService.get req.body.id

      # If it is valid.
      if contest && (contest.state == 'Type' || contest.state == 'Done')
        if req.session.hasOwnProperty contest.id
          res.json { user: req.session[contest.id], users: contest.users, words: contest.words, winner: contest.winner }
        else
          (res.status 401).send 'Need to join!'
      else
        (res.status 404).send 'Contest not found!'
    else
      (res.status 400).send 'Missing contest id!'

  # Chat.
  app.post '/chat', (req, res) ->
    if req.body.id
      # Fetching contest.
      contest = contestService.get req.body.id

      # If it is valid.
      if contest
        if contest.state == 'Waiting'
          if req.session.hasOwnProperty contest.id
            res.json { user: req.session[contest.id], users: contest.users }
          else
            (res.status 401).send 'Need to join!'
        else if contest.state == 'Type' && req.session.hasOwnProperty contest.id
          (res.status 410).send 'Typing already started!'
        else
          (res.status 404).send 'Contest not found!'
      else
        (res.status 404).send 'Contest not found!'
    else
      (res.status 400).send 'Missing contest id!'

  # Join contest.
  app.post '/join', (req, res) ->
    if req.body.user && req.body.captcha && req.body.id
      # Fetching contest.
      contest = contestService.get req.body.id

      # Check state.
      if contest && contest.state == 'Waiting'
        # Verifying captcha.
        request configs.CAPTCHA.VERIFY_URL + req.body.captcha + '&remoteip=' + req.ip, (error, response, body) ->
          if JSON.parse(body).success
            # Join user.
            userIndex = contest.join req.body.user

            # Session.
            req.session[contest.id] = userIndex

            # Inform users.
            ioService.emit contest.id, 'join', contest.users[userIndex]

            # Return result.
            res.end 'DONE'
          else
            (res.status 400).send 'CAPTCHA validation failed!'
      else
        (res.status 404).send 'Cannot join contest!'
    else
      (res.status 400).send 'Missing request parameters!'

  # Start contest.
  app.post '/start', (req, res) ->
    if req.body.words && req.body.user && req.body.captcha
      # Verifying captcha.
      request configs.CAPTCHA.VERIFY_URL + req.body.captcha + '&remoteip=' + req.ip, (error, response, body) ->
        if JSON.parse(body).success
          # Start contest.
          contest = contestService.start req.body.words, req.body.user

          # Setup IO.
          ioService.contest io, contest

          # Add session info.
          req.session[contest.id] = 0

          # Return result.
          res.end contest.id
        else
          (res.status 400).send 'CAPTCHA validation failed!'
    else
      (res.status 400).send 'Missing request parameters!'