# UUID module.
uuid = require 'node-uuid'

# Namespaces.
contests = {}

# Class for contest logic.
class Contest
  # Construct object.
  constructor: (@words, user) ->
    @id = uuid.v4()
    @created = Date.now()
    @state = 'Waiting'
    @users = [
      {
        name: user
        progress: 0
        creator: true
      }
    ]

    # Save reference.
    contests[@id] = this

  # Join method.
  join: (user) ->
    return (@users.push {
      name: user
      progress: 0
      creator: false
    }) - 1 # Return new user's index.

# Export object.
module.exports =
  # Starting contest.
  start: (words, user) ->
    new Contest words, user

  # Get.
  get: (contestId) ->
    contests[contestId]