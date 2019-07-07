const errors = {
    ArgvError: function (msg) {
        this.name = 'ArgvError';
        this.message = msg;
        Error.captureStackTrace(this, this.ArgvError)
    }
};

module.exports = errors;