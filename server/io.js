// Namespaces.
let namespaces = {};

// IO setup.
const setupIO = {
    // Contest.
    contest: (io, contest) => {
        // Setup namespace.
        let namespace = io.of(`/${contest.id}`);

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
    },

    // Emit.
    emit: (contestId, event, data) => {
        namespaces[contestId].emit(event, data);
    }
};

// Export IO setup.
module.exports = setupIO;