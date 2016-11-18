// UUID module.
const uuid = require('uuid');

// FS.
const fs = require('fs');

// Configs.
const configs = require('./configs');

// IO service.
const ioService = require('./io');

// Namespaces.
const contests = [];
let currentContest = null;

// Texts.
let texts = [];

// Class for contest logic.
class Contest {
    constructor(io) {
        this.id = uuid();
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

        // Register it.
        let currentContest = this.id;
        contests[currentContest] = this;

        // Setup IO.
        ioService.contest(io, this);

        // Setup cleanup.
        setTimeout(() => {
            delete contests[currentContest];
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
            // Return the first.
            return new Contest(io);
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