# UUID module.
uuid = require 'node-uuid'

# Configs.
configs = require './configs'

# FS.
fs = require 'fs'

# Namespaces.
contests = []
currentContest = null

# Texts.
texts = []

# IO service.
ioService = require './io'

# Class for contest logic.
class Contest
  # Construct object.
  constructor: (io) ->
    @id = uuid.v4()
    @started = Date.now()

    # Load new text.
    text = fs.readFileSync(__dirname + "/texts/" + texts[Math.floor(Math.random() * texts.length)], 'utf8')

    # Extract words.
    @words = text.trim().replace(/\t/g, ' ').replace(/\n/g, ' ').split(' ')
    @words = @words.filter (word) -> word.trim().length > 0

    # Set users.
    @users = []

    # Register it.
    currentContest = @id
    contests[currentContest] = this

    # Setup IO.
    ioService.contest io, this

    # Setup cleanup.
    setTimeout () ->
      delete contests[@id]
    , configs.CONTEST.DURATION

  # User joins contest.
  join: (sessionId) ->
    user = {id: sessionId, progress: 0}
    @users.push user

    return user

# Export object.
module.exports =
  setup: () ->
    # Read files in texts directory.
    texts = fs.readdirSync __dirname  + '/texts'

  # Starting contest.
  current: (io) ->
    # Not looping yet, start looping.
    if not currentContest or (Date.now() - contests[currentContest].started) >= configs.CONTEST.START
      # Return the first.
      new Contest(io)
    else
      # Return current.
      contests[currentContest]

  # Get contest by id.
  get: (id) ->
    contests[id]

  # Join contest.
  join: (sessionId, id) ->
    # Joined user.
    user = contests[id].join(sessionId)

    # Inform users.
    ioService.emit id, 'join', user
