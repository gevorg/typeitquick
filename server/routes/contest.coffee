# Configs.
configs = require '../configs'

# Contests.
contests = {}

# UUID module.
uuid = require 'node-uuid'

# Request module.
request = require 'request'

# Namespaces.
namespaces = {}

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
        creator: true
      }
    ]
  }

  # Add to cache.
  contests[contest.id] = contest

  # Return it.
  return contest.id

# Setup namespace.
setupNamespace = (io, contest) ->
  nsp = io.of '/' + contest
  nsp.on 'connection', (socket) ->
    # Setup message handler.
    socket.on 'msg', (data) ->
      nsp.emit 'msg', data

  namespaces[contest] = nsp

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
      contest = contests[req.body.id]

      # If it is valid.
      if contest && contest.state == 'Waiting'
        if req.session.hasOwnProperty contest.id
          res.json { user: req.session[contest.id], users: contest.users, words: contest.words }
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
      contest = contests[req.body.id]

      # If it is valid.
      if contest && contest.state == 'Waiting'
        if req.session.hasOwnProperty contest.id
          res.json { user: req.session[contest.id], users: contest.users }
        else
          (res.status 401).send 'Need to join!'
      else
        (res.status 404).send 'Contest not found!'
    else
      (res.status 400).send 'Missing contest id!'

  # Join contest.
  app.post '/join', (req, res) ->
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
              creator: false
            }

            # Join contest.
            newLength = contest.users.push user

            # Session.
            req.session[contest.id] = newLength - 1

            # Inform users.
            namespaces[contest.id].emit 'join', user

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
          # Create contest.
          contest = startContest req.body.words, req.body.user

          # Setup namespace.
          setupNamespace io, contest

          # Add session info.
          req.session[contest] = 0

          # Return result.
          res.end contest
        else
          (res.status 400).send 'CAPTCHA validation failed!'
    else
      (res.status 400).send 'Missing request parameters!'