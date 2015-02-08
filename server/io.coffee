# Namespaces.
namespaces = {}

# Class for socket io communication.
class IO
  # Construct object.
  constructor: (@io, @contest) ->
    @namespace = @io.of '/' + @contest.id

    # Default handlers.
    @namespace.on 'connection', (socket) =>
      # Setup message handler.
      socket.on 'msg', (data) =>
        @namespace.emit 'msg', data

      # Setup type handler.
      socket.on 'type', (data) =>
        @contest.state = 'Type'
        @contest.type = data.date

        @namespace.emit 'type', data

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