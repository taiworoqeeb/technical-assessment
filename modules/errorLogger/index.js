const { createLogger, format, transports, addColors } = require('winston');

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

addColors(colors)

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.colorize({all: true, colors: colors, level: true, message: true}),
                format.timestamp({
                    format: 'DD/MM/YYYY, HH:mm:ss'
                }),
                format.metadata(),
                format.align(),
                format.prettyPrint({
                    colorize: true,
                    depth: 10
                }),
                format.printf(info => `${info.level}  - ${info.metadata.timestamp}  ${info.message}${ info.metadata.message ? ' - ' + info.metadata.message : ''}${ info.metadata.label ? ' - ' + info.metadata.label : ''}`),
            ),

            handleExceptions: true
        })
    ],
    exitOnError: false
})

const myStream = logger.stream = {
    write: function(message){
        logger.http(message);
    }
};

module.exports = {
    logger,
    myStream
}
