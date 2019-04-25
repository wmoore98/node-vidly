const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

require('winston-mongodb');
require('express-async-errors'); // for handling express route errors

const myFormat = printf((info) => {
    const { level, message, label, timestamp, metadata, stack } = info;
    if (!metadata && stack) info.metadata = { message: message.split('\n')[0], name: stack.split(':')[0], stack };

    let result = `${timestamp} [${label}] ${level}: ${message}`;
    if (metadata && metadata.stack) result += `\n${metadata.stack}`;
    return result;
});

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: 'vidly' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        myFormat
      ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'vidly-combined.log' }),
        new transports.File({ filename: 'vidly-error.log', level: 'error' }),
        new transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'error'})
    ],
    exceptionHandlers: [
        new transports.Console(),
        new transports.File({ filename: 'vidly-exceptions.log' }),
        new transports.MongoDB({ db: 'mongodb://localhost/vidly', level: 'error'})
    ]    
});

process.on('unhandledRejection', (ex) => {
    throw ex;
});

module.exports = logger;
