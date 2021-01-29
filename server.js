
// UNCAUGHT-EXCEPTION ERROR
process.on('uncaughtException', err => {
    console.log('An Error occured - UNCAUGHT EXCEPTION ERROR');
    const error = {
        name: err.name,
        message: err.message,
        stack: err.stack
    };
    console.log('ERROR =', error);

    process.exit(1);
});

// REQUIRE APP
const app = require('./app');

const port = process.env.PORT || 3000;

// LISTENING TO SERVER
const server = app.listen(port, () => {
    console.log(`Listening to server on port ${port}`);
});

// UNHANDLED-REJECTION ERROR
process.on('unhandledRejection', err => {

    console.log('An Error occured - UNHANDLED REJECTION ERROR');
    const error = {
        name: err.name,
        message: err.message
        // stack: err.stack
    };
    console.log('ERROR =', error);

    server.close(() => {
        process.exit(1);
    });
});
