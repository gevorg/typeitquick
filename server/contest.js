// UUID module.
const uuid = require('uuid');

// FS.
const fs = require('fs');

// Configs.
const configs = require('./configs');

// IO service.
const ioService = require('./io');

// Namespaces.
let contests = {};
let currentContest = null;

// Texts.
let texts = [];

// Class for contest logic.
class Contest {
    constructor() {
        let id = uuid();

        this.id = id;
        this.started = Date.now();

        // Load new text.
        let textFile = texts[Math.floor(Math.random() * texts.length)];
        let text = fs.readFileSync(`${__dirname}/texts/${textFile}`, 'utf8');

        // Extract words.
        let words = text.trim().split(/[\s\n]/g);
        words = words.filter((word) => word.trim().length > 0);

        // Assign prop.
        this.words = words;

        // Set users.
        this.users = [];

        // Setup cleanup.
        setTimeout(() => {
            if (currentContest === id) currentContest = null;
            delete contests[id];
        }, configs.CONTEST_DURATION);
    }

    // User joins contest.
    join(sessionId) {
        let user = { id: sessionId, progress: 0 };
        this.users.push(user);

        return user;
    }
}

// Export object.
module.exports = {
    // Setup function.
    setup: () => {
        // Read files in texts directory.
        texts = fs.readdirSync(`${__dirname}/texts`);
    },

    // Starting contest.
    current: (io) => {
        // Not looping yet, start looping.
        if (!currentContest || (Date.now() - contests[currentContest].started) >= configs.CONTEST_START) {
            let contest = new Contest();

            // Setup IO.
            ioService.contest(io, contest);

            // Register contest.
            contests[contest.id] = contest;
            currentContest = contest.id;

            // Return the first.
            return contest;
        } else {
            // Return current.
            return contests[currentContest];
        }
    },

    // Get contest by id.
    get: (id) => {
        return contests[id];
    },

    // Join contest.
    join: (sessionId, id) => {
        // Joined.
        let user = contests[id].join(sessionId);

        // Inform.
        ioService.emit(id, 'join', user);
    }
};