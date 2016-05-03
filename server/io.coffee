# Namespaces.
namespaces = {}

# Class for socket io communication.
class IO
  # Construct object.
  constructor: (@io, @contest) ->
    @namespace = @io.of '/' + @contest.id

    # Default handlers.
    @namespace.on 'connection', (socket) =>
      # Done handler.
      socket.on 'done', (data) =>
        @contest.winner = data.winner
        socket.broadcast.emit 'done', data

      # Word handler.
      socket.on 'word', (data) =>
        for user in @contest.users
          if user.id is data.user
            user.progress = data.progress
            break

        @namespace.emit 'word', data

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