# Namespaces.
namespaces = {}

# Class for socket io communication.
class IO
  # Construct object.
  constructor: (@io, @contest) ->
    @namespace = @io.of '/' + @contest.id

    # Default handlers.
    @namespace.on 'connection', (socket) =>
      # Word handler.
      socket.on 'word', (data) =>
        if not @contest.winner
          # Update user's progress.
          for user in @contest.users
            if user.id is data.user
              # Update progress.
              user.progress = data.progress

              # Winner check.
              if user.progress is @contest.words.length
                @contest.winner = user.id

              # Broadcast word done.
              socket.broadcast.emit 'word', data
              break

    # Add to namespace object.
    namespaces[@contest.id] = @namespace

# Export object.
module.exports =
  # Setup.
  contest: (io, contest) ->
    new IO io, contest

  # Emit.
  emit: (contestId, event, data) ->
    namespaces[contestId].emit event, data