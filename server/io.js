// Namespaces.
const namespaces = {};

// Class for IO.
class IO {
    constructor(io, contest) {
        // Setup namespace.
        let namespace = io.of(`/${contest.id}`);

        // Assign props.
        this.contest = contest;
        this.namespace = namespace;

        // Add to namespaces object.
        namespaces[contest.id] = namespace;

        // Setup handlers.
        namespace.on('connection', (socket) => {
            // Word handler.
            socket.on('word', (data) => {
                if (!contest.winner) {
                    // Update user's progress.
                    contest.users.forEach((user) => {
                        if (user.id == data.user) {
                            // Update progress.
                            user.progress = data.progress;

                            // Winner check.
                            if (user.progress ==  contest.words.length) {
                                contest.winner = user.id
                            }

                            // Broadcast word done.
                            socket.broadcast.emit('word', data);
                        }
                    })
                }
            });
        });
    }
}

// Export IO.
module.exports = {
    // Contest.
    contest: (io, contest) => {
        return new IO(io, contest);
    },

    // Emit.
    emit: (contestId, event, data) => {
        namespaces[contestId].emit(event, data);
    }
};