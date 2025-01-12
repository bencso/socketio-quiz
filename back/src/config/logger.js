const winston = require("winston");
// Logoló beállítás
//? A logolásra winstont használunk, hogy átláthatóbb legyen az egész.
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.label({ label: "WebsocketServer" }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({
                    all: true,
                }),
                winston.format.printf(
                    (log) => `${log.timestamp} [\x1b[36m${log.label}\x1b[0m - ${log.level}]: ${log.message}`
                ),
            ),
        }),
        new winston.transports.File({
            filename: "server.log", format: winston.format.combine(
                winston.format.printf(
                    (log) => `${log.timestamp} [${log.label} - ${log.level}]: ${log.message}`
                ),
            ),
        }),
    ],
});

module.exports = logger;